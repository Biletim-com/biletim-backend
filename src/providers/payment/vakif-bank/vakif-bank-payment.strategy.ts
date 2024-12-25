import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { VakifBankEnrollmentService } from './services/vakif-bank-enrollment.service';
import { PoxClientService } from '@app/providers/pox-client/provider.service';
import { PaymentConfigService } from '@app/configs/payment';
import { HtmlTemplateService } from '@app/providers/html-template/provider.service';

// interfaces
import { IPayment } from '../interfaces/payment.interface';

// decorators
import { InjectPoxClient } from '@app/providers/pox-client/decorators';

// enums
import { PaymentProvider } from '@app/common/enums';

// types
import {
  VposResponse,
  SaleResponse,
  CancelResponse,
  RefundResponse,
} from './types/v-pos-response.type';

// constants
import { threeDSecureResponse } from './constants/3d-response.constant';
import { vPOSResponse } from './constants/vpos-reponse.constant';

// dtos
import {
  VakifBankPaymentResultDto,
  VakifBankSavedCardPaymentFinishDto,
} from './dto/vakif-bank-payment-result.dto';
import { VakifBankPaymentStartDto } from './dto/vakif-bank-payment-start.dto';
import { PaymentFinishDto } from '../dto/payment-finish.dto';

// utils
import { normalizeDecimal } from '@app/common/utils';

// helpers
import { VakifBankCurrency } from './helpers/vakif-bank-currency.helper';
import { VakifBankCustomerHelperService } from './helpers/vakif-bank-customer.helper.service';

@Injectable()
export class VakifBankPaymentStrategy implements IPayment {
  private readonly logger = new Logger(VakifBankPaymentStrategy.name);

  constructor(
    @InjectPoxClient(`${PaymentProvider.VAKIF_BANK}_VPOS`)
    private readonly poxClientService: PoxClientService,
    private readonly paymentConfigService: PaymentConfigService,
    private readonly vakifBankEnrollmentService: VakifBankEnrollmentService,
    private readonly htmlTemplateService: HtmlTemplateService,
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
      this.logger.error(`${description}, ${detail}`);
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
      MerchantId: this.paymentConfigService.vakifBankMerchantId,
      Password: this.paymentConfigService.vakifBankMerchantPassword,
      TerminalNo: this.paymentConfigService.vakifBankTerminalNumber,
    };
  }

  async startPayment({
    ticketType,
    transaction,
    paymentMethod: { bankCard },
  }: VakifBankPaymentStartDto): Promise<string> {
    const card3DsEligibility =
      await this.vakifBankEnrollmentService.checkCard3DsEligibility(
        ticketType,
        transaction,
        bankCard,
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

  finishPayment({
    clientIp,
    orderId,
    details,
  }: PaymentFinishDto<
    VakifBankPaymentResultDto | VakifBankSavedCardPaymentFinishDto
  >): Promise<SaleResponse> {
    let vPosRequestBody = {};
    if (this.isVakifBank3DSPaymentResultDto(details)) {
      vPosRequestBody = {
        Pan: details.Pan,
        ECI: details.Eci,
        CAVV: details.Cavv,
        MpiTransactionId: details.VerifyEnrollmentRequestId,
        CurrencyAmount: normalizeDecimal(details.PurchAmount),
        CurrencyCode: details.PurchCurrency,
        TransactionType: 'Sale',
        TransactionId: details.VerifyEnrollmentRequestId,
        OrderId: orderId,
        ClientIp: clientIp,
        TransactionDeviceSource: 0,
      };
    } else {
      vPosRequestBody = {
        ...this.authCredentials,
        PanCode: details.cardToken,
        CustomerNumber: VakifBankCustomerHelperService.generateVPosCustomerId(
          details.userId,
        ),
        CurrencyAmount: normalizeDecimal(details.amount),
        CurrencyCode: VakifBankCurrency[details.currency],
        TransactionType: 'Sale',
        TransactionId: details.transactionId,
        OrderId: orderId,
        ClientIp: clientIp,
        TransactionDeviceSource: 0,
      };
    }
    return this.sendRequest('/VposService/v3/Vposreq.aspx', {
      VposRequest: { ...this.authCredentials, ...vPosRequestBody },
    });
  }

  /**
   * İptal işlemleri, başarılı gerçekleşmiş ve henüz günsonu alınmamış bir satış veya iade işlemini iptal etmek için kullanılır.
   */
  async cancelPayment({ clientIp, transactionId }): Promise<CancelResponse> {
    const body = {
      VposRequest: {
        ...this.authCredentials,
        TransactionType: 'Cancel',
        ReferenceTransactionId: transactionId,
        ClientIp: clientIp,
      },
    };
    const resp = await this.sendRequest<CancelResponse>(
      '/VposService/v3/Vposreq.aspx',
      body,
    );
    this.logger.log(`CancelVakifBankPayment: ${transactionId}`);
    return resp;
  }

  /**
   * İade işlemi, başarılı gerçekleşmiş ve günsonu alınarak finansallaşmış bir işlemi iade etmek için kullanılır.
   */
  async refundPayment({
    clientIp,
    transactionId,
    refundAmount,
  }): Promise<RefundResponse> {
    const body = {
      VposRequest: {
        ...this.authCredentials,
        TransactionType: 'Refund',
        ReferenceTransactionId: transactionId,
        CurrencyAmount: refundAmount,
        ClientIp: clientIp,
      },
    };

    const resp = await this.sendRequest<RefundResponse>(
      '/VposService/v3/Vposreq.aspx',
      body,
    );
    this.logger.log(`RefundVakifBankPayment: ${transactionId}:${refundAmount}`);
    return resp;
  }

  private isVakifBank3DSPaymentResultDto(
    details: VakifBankPaymentResultDto | VakifBankSavedCardPaymentFinishDto,
  ): details is VakifBankPaymentResultDto {
    return (details as VakifBankPaymentResultDto).Pan !== undefined;
  }
}
