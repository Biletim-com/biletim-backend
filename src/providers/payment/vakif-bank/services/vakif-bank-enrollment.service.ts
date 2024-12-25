import * as dayjs from 'dayjs';
import { Injectable } from '@nestjs/common';

import { AppConfigService } from '@app/configs/app';
import { PaymentConfigService } from '@app/configs/payment';
import { PoxClientService } from '@app/providers/pox-client/provider.service';
import { Transaction } from '@app/modules/transactions/transaction.entity';

// decorators
import { InjectPoxClient } from '@app/providers/pox-client/decorators';

// enums
import { Currency, PaymentProvider, TicketType } from '@app/common/enums';

// types
import { EnrollmentResponse } from '../types/enrollment-response.type';
import { ThreeDSecureEligibilityResponse } from '../types/3ds-eligibility.type';

// dtos
import { BankCardDto } from '@app/common/dtos';

// utils
import { normalizeDecimal } from '@app/common/utils';

// helpers
import { VakifBankCurrency } from '../helpers/vakif-bank-currency.helper';
import { VakifBankBankCardBrand } from '../helpers/vakif-bank-credit-card-brand.helper';

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
      MerchantId: this.paymentConfigService.vakifBankMerchantId,
      MerchantPassword: this.paymentConfigService.vakifBankMerchantPassword,
    };
  }

  async checkCard3DsEligibility(
    ticketType: TicketType,
    transaction: Transaction,
    bankCard: BankCardDto,
  ): Promise<ThreeDSecureEligibilityResponse> {
    const body = {
      ...this.authCredentials,
      VerifyEnrollmentRequestId: transaction.id,
      Pan: bankCard.pan,
      ExpiryDate: dayjs(bankCard.expiryDate).format('YYMM'),
      PurchaseAmount: normalizeDecimal(transaction.amount),
      Currency: VakifBankCurrency[Currency.TRY],
      BrandName: VakifBankBankCardBrand[bankCard.cardType],
      SuccessUrl: `${this.applicationConfigService.backendUrl}/payment/success?transactionId=${transaction.id}&ticketType=${ticketType}`,
      FailureUrl: `${this.applicationConfigService.backendUrl}/payment/failure?transactionId=${transaction.id}&ticketType=${ticketType}`,
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
