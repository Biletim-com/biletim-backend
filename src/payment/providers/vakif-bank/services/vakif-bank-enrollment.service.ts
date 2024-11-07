import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';

import { AppConfigService } from '@app/configs/app';
import { PaymentConfigService } from '@app/configs/payment';
import { PoxClientService } from '@app/providers/pox-client/provider.service';

// decorators
import { InjectPoxClient } from '@app/providers/pox-client/decorators';

// enums
import { PaymentProvider } from '@app/common/enums';

// types
import { EnrollmentResponse } from '../types/enrollment-response.type';
import { ThreeDSecureEligibilityResponse } from '../types/3ds-eligibility.type';

// dtos
import { CreditCardDto } from '@app/common/dtos';

// utils
import { normalizeDecimal } from '@app/common/utils';
import { Transaction } from '@app/modules/transactions/transaction.entity';

@Injectable()
export class VakifBankEnrollmentService {
  constructor(
    @InjectPoxClient(`${PaymentProvider.VAKIF_BANK}_3DS`)
    private readonly poxClientService: PoxClientService,
    private readonly paymentConfigService: PaymentConfigService,
    private readonly applicationConfigService: AppConfigService,
  ) {}

  private async sendRequest<T extends EnrollmentResponse>(
    body: Record<string, any>,
  ): Promise<T> {
    return this.poxClientService.request<T>({
      method: 'POST',
      path: '/MPIAPI/MPI_Enrollment.aspx',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  private get authCredentials(): {
    MerchantId: string;
    MerchantPassword: string;
  } {
    return {
      MerchantId: this.paymentConfigService.merchantId,
      MerchantPassword: this.paymentConfigService.merchantPassword,
    };
  }

  async checkCard3DsEligibility(
    transaction: Transaction,
    creditCard: CreditCardDto,
  ): Promise<ThreeDSecureEligibilityResponse> {
    const body = {
      ...this.authCredentials,
      VerifyEnrollmentRequestId: transaction.id,
      Pan: creditCard.pan,
      ExpiryDate: dayjs(creditCard.expiryDate).format('YYMM'),
      PurchaseAmount: normalizeDecimal(transaction.amount),
      // TODO: Update those fields
      Currency: '949', //949:TRY 840:USD 978:EUR 826:GBP
      BrandName: '100', // 100:VISA 200:MASTERCARD 300:TROY
      SuccessUrl: `${this.applicationConfigService.backendUrl}/payment/success?provider=${PaymentProvider.VAKIF_BANK}`,
      FailureUrl: `${this.applicationConfigService.backendUrl}/payment/failure?provider=${PaymentProvider.VAKIF_BANK}`,
    };

    const {
      IPaySecure: {
        Message: { VERes },
        MessageErrorCode,
        VerifyEnrollmentRequestId,
      },
    } = await this.sendRequest(body);

    if (VERes.Status === 'Y') {
      return {
        isEligibile: true,
        details: VERes,
        requestId: VerifyEnrollmentRequestId,
      };
    }
    return {
      isEligibile: false,
      errorResponseCode: MessageErrorCode,
      requestId: VerifyEnrollmentRequestId,
    };
  }
}
