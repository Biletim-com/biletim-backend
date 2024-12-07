import { Injectable } from '@nestjs/common';

// services
import { AppConfigService } from '@app/configs/app';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { BiletAllEncryptorService } from './services/biletall-encryptor.service';
import { HtmlTemplateService } from '../../html-template/provider.service';
import { BiletAllBusTicketPurchaseService } from '../../ticket/biletall/bus/services/biletall-bus-ticket-purchase.service';

// entites
import { Transaction } from '@app/modules/transactions/transaction.entity';

// interfaces
import { IPayment } from '../interfaces/payment.interface';

// dtos
import { BankCardDto } from '@app/common/dtos';

// enums
import { PaymentProvider, TicketType } from '@app/common/enums';

@Injectable()
export class BiletAllPaymentStrategy implements IPayment {
  private readonly biletAllEncryptorService = BiletAllEncryptorService;

  constructor(
    private readonly biletAllApiConfigService: BiletAllApiConfigService,
    private readonly applicationConfigService: AppConfigService,
    private readonly htmlTemplateService: HtmlTemplateService,
    private readonly biletAllBusTicketPurchaseService: BiletAllBusTicketPurchaseService,
  ) {}

  private get authCredentials() {
    return `<Kullanici><Adi>${this.biletAllApiConfigService.biletAllApiUsername}</Adi><Sifre>${this.biletAllApiConfigService.biletAllApiPassword}</Sifre></Kullanici>`;
  }

  async startPayment(
    clientIp: string,
    ticketType: TicketType,
    bankCard: BankCardDto,
    transaction: Transaction,
  ): Promise<string> {
    const { encode } = this.biletAllEncryptorService;
    const saleXml = await this.biletAllBusTicketPurchaseService.purchaseTicket(
      clientIp,
      transaction,
      transaction.order,
      transaction.order.busTickets,
      bankCard,
    );

    const templateData = {
      formAction: this.biletAllApiConfigService.biletAll3DSBaseUrl,
      fields: [
        {
          name: 'satisXML',
          value: encode(saleXml),
        },
        {
          name: 'yetkiXML',
          value: encode(this.authCredentials),
        },
        {
          name: 'successURL',
          value: encode(
            `${this.applicationConfigService.backendUrl}/payment/success?provider=${PaymentProvider.BILET_ALL}&transactionId=${transaction.id}&ticketType=${ticketType}`,
          ),
        },
        {
          name: 'failURL',
          value: encode(
            `${this.applicationConfigService.backendUrl}/payment/failure?provider=${PaymentProvider.BILET_ALL}&transactionId=${transaction.id}&ticketType=${ticketType}`,
          ),
        },
      ],
    };

    const htmlString = await this.htmlTemplateService.renderTemplate(
      '3d-secure',
      templateData,
    );
    return htmlString;
  }

  finishPayment(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  cancelPayment(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  refundPayment(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
