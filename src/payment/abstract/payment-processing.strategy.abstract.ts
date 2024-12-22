import { Logger } from '@nestjs/common';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';

// dto
import { PaymentResultDto } from '../dto/payment-result.dto';
import { BusTicketPurchaseResultDto } from '@app/providers/ticket/biletall/bus/dto/bus-ticket-purchase-result.dto';
import { VakifBankPaymentResultDto } from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';

// types
import { UUID } from '@app/common/types';

// constants
import { threeDSecureResponse } from '@app/providers/payment/vakif-bank/constants/3d-response.constant';
import { ServiceError } from '@app/common/errors';

export abstract class PaymentProcessingStrategy {
  constructor(protected readonly logger: Logger) {}

  abstract handlePayment(
    clientIp: string,
    transactionId: UUID,
    paymentResultDto: PaymentResultDto,
  ): Promise<Transaction>;
  abstract handlePaymentFailure(
    transactionOrTransactionId: Transaction | UUID,
    errorMessage?: string,
  ): Promise<void>;

  public validatePaymentResponseStatus(
    paymentResultDetails: PaymentResultDto['details'],
  ) {
    const defaultErrorMessage = 'Error happened during 3DS';

    const handleError = (condition: boolean, errorMessage: string) => {
      if (condition) {
        this.logger.error(errorMessage);
        throw new ServiceError(errorMessage);
      }
    };

    if (this.isBiletAllDetails(paymentResultDetails)) {
      handleError(
        paymentResultDetails.result === false,
        paymentResultDetails.message ?? defaultErrorMessage,
      );
    }

    if (this.isVakifBankDetails(paymentResultDetails)) {
      const errorMessage =
        paymentResultDetails.ErrorMessage ?? defaultErrorMessage;
      const { description, detail } =
        threeDSecureResponse[paymentResultDetails.ErrorCode] || {};
      handleError(
        paymentResultDetails.Status !== 'Y',
        `${description}, ${detail}: ${errorMessage}`,
      );
    }
  }

  private isBiletAllDetails(
    details: PaymentResultDto['details'],
  ): details is BusTicketPurchaseResultDto {
    return 'result' in details;
  }

  private isVakifBankDetails(
    details: PaymentResultDto['details'],
  ): details is VakifBankPaymentResultDto {
    return 'Status' in details;
  }
}
