import { Injectable } from '@nestjs/common';

// services
import { AppConfigService } from '@app/configs/app';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { BiletAllEncryptorService } from './services/biletall-encryptor.service';
import { HtmlTemplateService } from '../../services/html-template.service';
import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';

// entites
import { Transaction } from '@app/modules/transactions/transaction.entity';

// interfaces
import { IPayment } from '@app/payment/interfaces/payment.interface';

// dtos
import { CreditCardDto } from '@app/common/dtos';

// enums
import { PaymentProvider } from '@app/common/enums';

@Injectable()
export class BiletAllPaymentStrategy implements IPayment {
  private readonly biletAllEncryptorService = BiletAllEncryptorService;

  constructor(
    private readonly biletAllApiConfigService: BiletAllApiConfigService,
    private readonly applicationConfigService: AppConfigService,
    private readonly htmlTemplateService: HtmlTemplateService,
    private readonly biletAllBusService: BiletAllBusService,
  ) {}

  private get authCredentials() {
    return `<Kullanici><Adi>${this.biletAllApiConfigService.biletAllApiUsername}</Adi><Sifre>${this.biletAllApiConfigService.biletAllApiPassword}</Sifre></Kullanici>`;
  }

  async startPayment(
    clientIp: string,
    creditCard: CreditCardDto,
    transaction: Transaction,
  ): Promise<string> {
    const { encode } = this.biletAllEncryptorService;
    const saleXml = await this.biletAllBusService.saleRequest(
      clientIp,
      transaction,
      transaction.order,
      transaction.order.busTickets,
      creditCard,
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
            `${this.applicationConfigService.backendUrl}/payment/success?provider=${PaymentProvider.BILET_ALL}&transactionId=${transaction.id}`,
          ),
        },
        {
          name: 'failURL',
          value: encode(
            `${this.applicationConfigService.backendUrl}/payment/failure?provider=${PaymentProvider.BILET_ALL}&transactionId=${transaction.id}`,
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
