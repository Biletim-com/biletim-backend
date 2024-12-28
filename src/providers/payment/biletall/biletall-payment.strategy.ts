import { Injectable } from '@nestjs/common';

// services
import { AppConfigService } from '@app/configs/app';
import { PaymentConfigService } from '@app/configs/payment';
import { BiletAllEncryptorService } from './helpers/biletall-encryptor.service';
import { HtmlTemplateService } from '../../html-template/provider.service';
import { BiletAllBusTicketPurchaseService } from '../../ticket/biletall/bus/services/biletall-bus-ticket-purchase.service';

// interfaces
import { IPayment } from '../interfaces/payment.interface';

// dtos
import { BiletAllPaymentStart3DSAuthorizationDto } from './dto/biletall-payment-start.dto';

@Injectable()
export class BiletAllPaymentStrategy implements IPayment {
  private readonly biletAllEncryptorService = BiletAllEncryptorService;

  constructor(
    private readonly paymentConfigService: PaymentConfigService,
    private readonly applicationConfigService: AppConfigService,
    private readonly htmlTemplateService: HtmlTemplateService,
    private readonly biletAllBusTicketPurchaseService: BiletAllBusTicketPurchaseService,
  ) {}

  private get authCredentials() {
    return `<Kullanici><Adi>${this.paymentConfigService.biletAll3DSUsername}</Adi><Sifre>${this.paymentConfigService.biletAll3DSPassword}</Sifre></Kullanici>`;
  }

  async start3DSAuthorization({
    clientIp,
    paymentFlowType,
    transaction,
    paymentMethod: { bankCard },
  }: BiletAllPaymentStart3DSAuthorizationDto): Promise<string> {
    const { encode } = this.biletAllEncryptorService;
    const saleXml = await this.biletAllBusTicketPurchaseService.purchaseTicket(
      clientIp,
      transaction,
      transaction.busTicketOrder,
      transaction.busTicketOrder.tickets,
      bankCard,
    );

    const templateData = {
      formAction: this.paymentConfigService.biletAll3DSBaseUrl,
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
            `${this.applicationConfigService.backendUrl}/payment/success?transactionId=${transaction.id}&paymentFlowType=${paymentFlowType}`,
          ),
        },
        {
          name: 'failURL',
          value: encode(
            `${this.applicationConfigService.backendUrl}/payment/failure?transactionId=${transaction.id}&paymentFlowType=${paymentFlowType}`,
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
