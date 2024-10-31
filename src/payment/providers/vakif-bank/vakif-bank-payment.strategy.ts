import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { Transaction } from '@app/modules/transactions/transaction.entity';
import { VakifBankEnrollmentService } from './services/vakif-bank-enrollment.service';
import { PoxClientService } from '@app/providers/pox-client/provider.service';
import { PaymentConfigService } from '@app/configs/payment';

// interfaces
import { IPayment } from '../../interfaces/payment.interface';

// decorators
import { InjectPoxClient } from '@app/providers/pox-client/decorators';

// enums
import { PaymentProvider } from '@app/common/enums';

// dtos
import { CreditCardDto } from '@app/common/dtos';
import { PaymentResultDto } from '@app/payment/dto/payment-result.dto';

// types
import { VposResponse, SaleResponse } from './types/v-pos-response.type';

// constants
import { threeDSecureResponse } from './constants/3d-response.constant';
import { vPOSResponse } from './constants/vpos-reponse.constant';
import { UUID } from '@app/common/types';
import { normalizeDecimal } from '@app/common/utils';

@Injectable()
export class VakifBankPaymentStrategy implements IPayment {
  private readonly logger = new Logger(VakifBankPaymentStrategy.name);

  constructor(
    @InjectPoxClient(`${PaymentProvider.VAKIF_BANK}_VPOS`)
    private readonly poxClientService: PoxClientService,
    private readonly paymentConfigService: PaymentConfigService,
    private readonly vakifBankEnrollmentService: VakifBankEnrollmentService,
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
    creditCard: CreditCardDto,
    transaction: Transaction,
  ): Promise<string> {
    const card3DsEligibility =
      await this.vakifBankEnrollmentService.checkCard3DsEligibility(
        transaction.id,
        transaction.amount,
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
    return `<html>
             <head>
             <title>GET724 MPI 3D-Secure Processing Page</title>
             </head>
             <body >
                 <form name="downloadForm" action="${ACSUrl}" method="POST">
                 <noscript>
                 <br>
                 <br>
                 <center>
                     <h1>Processing your 3-D Secure Transaction</h1>
                     <h2>
                         JavaScript is currently disabled or is not supported by your browser.
                     <br>
                     </h2>
                     <h3>Please click Submit to continue the processing of your 3-D Secure transaction. Enrolled Returns true</h3>
                     <input type="submit" value="Submit">
                 </center>
                 </noscript>
                     <input type="hidden" name="PaReq" value="${PaReq}">
                     <input type="hidden" name="TermUrl" value="${TermUrl}">
                     <input type="hidden" name="MD" value="${MD}">
                 </form>
                 <SCRIPT LANGUAGE="Javascript" >
                     document.downloadForm.submit();
                 </SCRIPT>
             </body>
         </html>
         `;
  }

  finishPayment(
    paymentDetailsDto: PaymentResultDto,
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
        ClientIp: '190.20.13.12',
        TransactionDeviceSource: 0,
      },
    };
    return this.sendRequest('/VposService/v3/Vposreq.aspx', body);
  }

  cancelPayment(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  refundPayment(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
