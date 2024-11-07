import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { Transaction } from '@app/modules/transactions/transaction.entity';
import { VakifBankEnrollmentService } from './services/vakif-bank-enrollment.service';
import { PoxClientService } from '@app/providers/pox-client/provider.service';
import { PaymentConfigService } from '@app/configs/payment';
import { HtmlTemplateService } from '@app/payment/services/html-template.service';
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';

// interfaces
import { IPayment } from '../../interfaces/payment.interface';

// decorators
import { InjectPoxClient } from '@app/providers/pox-client/decorators';

// enums
import { PaymentProvider } from '@app/common/enums';

// dtos
import { CreditCardDto } from '@app/common/dtos';
import { VakifBankPaymentResultDto } from '@app/payment/dto/vakif-bank-payment-result.dto';

// types
import {
  VposResponse,
  SaleResponse,
  CancelResponse,
  RefundResponse,
} from './types/v-pos-response.type';
import { UUID } from '@app/common/types';

// constants
import { threeDSecureResponse } from './constants/3d-response.constant';
import { vPOSResponse } from './constants/vpos-reponse.constant';

// utils
import { normalizeDecimal } from '@app/common/utils';

@Injectable()
export class VakifBankPaymentStrategy implements IPayment {
  private readonly logger = new Logger(VakifBankPaymentStrategy.name);

  constructor(
    @InjectPoxClient(`${PaymentProvider.VAKIF_BANK}_VPOS`)
    private readonly poxClientService: PoxClientService,
    private readonly paymentConfigService: PaymentConfigService,
    private readonly vakifBankEnrollmentService: VakifBankEnrollmentService,
    private readonly htmlTemplateService: HtmlTemplateService,
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  private async sendRequest<T extends VposResponse>(
    path: string,
    body: Record<string, any>,
  ) {
    const response = await this.poxClientService.request<T>({
      method: 'POST',
      path,
      body: { prmstr: body },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.VposResponse.ResultCode !== '0000') {
      const { description, detail } =
        vPOSResponse[response.VposResponse.ResultCode];
      this.logger.error({ description, detail });
      throw new BadRequestException(response.VposResponse.ResultDetail);
    }
    return response;
  }

  private get authCredentials(): {
    MerchantId: string;
    Password: string;
    TerminalNo: string;
  } {
    return {
      MerchantId: this.paymentConfigService.merchantId,
      Password: this.paymentConfigService.merchantPassword,
      TerminalNo: this.paymentConfigService.terminalNo,
    };
  }

  async startPayment(
    _clientIp: string,
    creditCard: CreditCardDto,
    transaction: Transaction,
  ): Promise<string> {
    const card3DsEligibility =
      await this.vakifBankEnrollmentService.checkCard3DsEligibility(
        transaction,
        creditCard,
      );

    if (!card3DsEligibility.isEligibile) {
      const { description, detail } =
        threeDSecureResponse[card3DsEligibility.errorResponseCode];
      throw new BadRequestException(detail || description);
    }

    if (transaction.id !== card3DsEligibility.requestId) {
      throw new BadRequestException('Invalid request id');
    }

    const { ACSUrl, PaReq, TermUrl, MD } = card3DsEligibility.details;

    const templateData = {
      formAction: ACSUrl,
      fields: [
        {
          name: 'PaReq',
          value: PaReq,
        },
        {
          name: 'TermUrl',
          value: TermUrl,
        },
        {
          name: 'MD',
          value: MD,
        },
      ],
    };

    const htmlString = await this.htmlTemplateService.renderTemplate(
      '3d-secure',
      templateData,
    );
    return htmlString;
  }

  finishPayment(
    clientIp: string,
    paymentDetailsDto: VakifBankPaymentResultDto,
    orderId: UUID,
  ): Promise<SaleResponse> {
    const {
      PurchAmount,
      Pan,
      PurchCurrency,
      VerifyEnrollmentRequestId,
      Eci,
      Cavv,
    } = paymentDetailsDto;
    const body = {
      VposRequest: {
        ...this.authCredentials,
        Pan,
        CurrencyAmount: normalizeDecimal(PurchAmount),
        CurrencyCode: PurchCurrency,
        TransactionType: 'Sale',
        TransactionId: VerifyEnrollmentRequestId,
        ECI: Eci,
        CAVV: Cavv,
        MpiTransactionId: VerifyEnrollmentRequestId,
        OrderId: orderId,
        ClientIp: clientIp,
        TransactionDeviceSource: 0,
      },
    };
    return this.sendRequest('/VposService/v3/Vposreq.aspx', body);
  }

  /**
   * İptal işlemleri, başarılı gerçekleşmiş ve henüz günsonu alınmamış bir satış veya iade işlemini iptal etmek için kullanılır.
   */
  async cancelPayment(
    clientIp: string,
    transactionOrTransactionId: UUID | Transaction,
  ): Promise<CancelResponse> {
    const transaction = await this.transactionsRepository.findEntityData(
      transactionOrTransactionId,
    );

    const body = {
      VposRequest: {
        ...this.authCredentials,
        TransactionType: 'Cancel',
        ReferenceTransactionId: transaction.id,
        ClientIp: clientIp,
      },
    };
    return this.sendRequest('/VposService/v3/Vposreq.aspx', body);
  }

  /**
   * İade işlemi, başarılı gerçekleşmiş ve günsonu alınarak finansallaşmış bir işlemi iade etmek için kullanılır.
   */
  async refundPayment(
    clientIp: string,
    transactionOrTransactionId: UUID | Transaction,
  ): Promise<RefundResponse> {
    const transaction = await this.transactionsRepository.findEntityData(
      transactionOrTransactionId,
    );
    const body = {
      VposRequest: {
        ...this.authCredentials,
        TransactionType: 'Refund',
        CurrencyAmount: transaction.amount,
        ReferenceTransactionId: transaction.id,
        ClientIp: clientIp,
      },
    };
    return this.sendRequest('/VposService/v3/Vposreq.aspx', body);
  }
}
