import { Injectable, Logger } from '@nestjs/common';

// dtos
import { VakifBankPaymentResultDto } from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';
import { BusTicketPurchaseResultDto } from '@app/providers/ticket/biletall/bus/dto/bus-ticket-purchase-result.dto';

// constants
import { threeDSecureResponse } from '@app/providers/payment/vakif-bank/constants/3d-response.constant';

// errors
import { ServiceError } from '@app/common/errors';
import { IPaymentProcessingStrategy } from '../interfaces/payment-processing.strategy.interface';
import { UUID } from '@app/common/types';
import { PaymentProcessingFactory } from '../factories/payment-processing.factory';

// enums
import { PaymentFlowType } from '@app/common/enums';

// types
import { BusTicketPurchaseResult } from '@app/providers/ticket/biletall/bus/types/biletall-bus-ticket-purchase-result.type';

@Injectable()
export class PaymentProcessingService {
  private readonly logger = new Logger(PaymentProcessingService.name);
  private readonly defaultErrorMessage =
    'Error happened while processing payment';

  constructor(
    private readonly paymentProcessingFactory: PaymentProcessingFactory,
  ) {}

  public async processPayment(
    clientIp: string,
    transactionIdQuery: UUID,
    paymentFlowType: PaymentFlowType,
    requestBody: VakifBankPaymentResultDto | BusTicketPurchaseResult,
  ) {
    const paymentResultDetails = this.obtainPaymentResponseDetails(requestBody);
    const transactionId =
      paymentResultDetails?.['VerifyEnrollmentRequestId'] || transactionIdQuery;

    const paymentProcessingStrategy =
      this.paymentProcessingFactory.getStrategy(paymentFlowType);

    try {
      await this.validatePaymentResponseStatus(
        transactionId,
        paymentProcessingStrategy,
        paymentResultDetails,
      );
      await paymentProcessingStrategy.handlePayment(
        clientIp,
        transactionId,
        paymentResultDetails,
      );
    } catch (err) {
      throw err;
    }
  }

  public failPayment(
    transactionIdQuery: UUID,
    paymentFlowType: PaymentFlowType,
    requestBody: VakifBankPaymentResultDto | BusTicketPurchaseResult,
  ): string | undefined {
    const paymentResultDetails = this.obtainPaymentResponseDetails(requestBody);
    const transactionId =
      paymentResultDetails?.['VerifyEnrollmentRequestId'] || transactionIdQuery;

    let errorMessage: string = 'Unknown error';
    if (this.isBiletAllDetails(paymentResultDetails)) {
      errorMessage = paymentResultDetails.message ?? this.defaultErrorMessage;
    }
    if (this.isVakifBankDetails(paymentResultDetails)) {
      errorMessage =
        paymentResultDetails.ErrorMessage ?? this.defaultErrorMessage;
    }

    const paymentProcessingStrategy =
      this.paymentProcessingFactory.getStrategy(paymentFlowType);
    paymentProcessingStrategy.handlePaymentFailure(transactionId, errorMessage);
    return errorMessage;
  }

  private async validatePaymentResponseStatus(
    transactionId: UUID,
    paymentProcessingStrategy: IPaymentProcessingStrategy,
    paymentResultDetails:
      | VakifBankPaymentResultDto
      | BusTicketPurchaseResultDto,
  ) {
    try {
      const handleError = (condition: boolean, errorMessage: string) => {
        if (condition) {
          this.logger.error(errorMessage);
          throw new ServiceError(errorMessage);
        }
      };

      if (this.isBiletAllDetails(paymentResultDetails)) {
        handleError(
          paymentResultDetails.result === false,
          paymentResultDetails.message ?? this.defaultErrorMessage,
        );
      }

      if (this.isVakifBankDetails(paymentResultDetails)) {
        const errorMessage =
          paymentResultDetails.ErrorMessage ?? this.defaultErrorMessage;
        const { description, detail } =
          threeDSecureResponse[paymentResultDetails.ErrorCode] || {};
        handleError(
          paymentResultDetails.Status !== 'Y',
          `${description}, ${detail}: ${errorMessage}`,
        );
      }
    } catch (err) {
      await paymentProcessingStrategy.handlePaymentFailure(
        transactionId,
        err.message,
      );
      throw err;
    }
  }

  private obtainPaymentResponseDetails(
    paymentResponseBody: VakifBankPaymentResultDto | BusTicketPurchaseResult,
  ): VakifBankPaymentResultDto | BusTicketPurchaseResultDto {
    if ('Sonuc' in paymentResponseBody) {
      return new BusTicketPurchaseResultDto(paymentResponseBody);
    }
    return paymentResponseBody;
  }

  private isBiletAllDetails(
    details: VakifBankPaymentResultDto | BusTicketPurchaseResultDto,
  ): details is BusTicketPurchaseResultDto {
    return 'result' in details;
  }

  private isVakifBankDetails(
    details: VakifBankPaymentResultDto | BusTicketPurchaseResultDto,
  ): details is VakifBankPaymentResultDto {
    return 'Status' in details;
  }
}
