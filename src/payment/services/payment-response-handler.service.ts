import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PaymentResultDto } from '../dto/payment-result.dto';
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';

// errors
import { TransactionNotFoundError } from '@app/common/errors';

// enums
import { PaymentProvider, TransactionStatus } from '@app/common/enums';
import { threeDSecureResponse } from '../providers/vakif-bank/constants/3d-response.constant';
import { PaymentProviderFactory } from '../factories/payment-provider.factory';

// utils
import { normalizeDecimal } from '@app/common/utils';

@Injectable()
export class PaymentResponseHandlerService {
  private readonly logger = new Logger(PaymentResponseHandlerService.name);

  constructor(
    private readonly transactionsRespository: TransactionsRepository,
    private readonly paymentProviderFactory: PaymentProviderFactory,
  ) {}

  async handleSuccessfulPayment(paymentResultDto: PaymentResultDto) {
    if (paymentResultDto.Status !== 'Y') {
      const { description, detail } =
        threeDSecureResponse[paymentResultDto.ErrorCode];
      this.logger.error({ description, detail });
      throw new BadRequestException(paymentResultDto.ErrorMessage);
    }

    const transaction = await this.transactionsRespository.findOne({
      where: {
        id: paymentResultDto.VerifyEnrollmentRequestId,
      },
      relations: {
        order: true,
      },
    });
    if (!transaction) {
      throw new TransactionNotFoundError();
    }
    try {
      const paymentProvider = this.paymentProviderFactory.getStrategy(
        PaymentProvider.VAKIF_BANK,
      );

      // update transaction status
      await this.transactionsRespository.update(transaction.id, {
        status: TransactionStatus.PROCESSING,
      });

      // send purchase request to biletall

      // make payment
      await paymentProvider.finishPayment(
        {
          ...paymentResultDto,
          PurchAmount: String(normalizeDecimal(transaction.amount)),
        },
        transaction.order.id,
      );

      // update transaction status
      await this.transactionsRespository.update(transaction.id, {
        status: TransactionStatus.COMPLETED,
      });

      /** SEND EVENTS */
      // create invoice and ticket output
      // send email or SMS
    } catch (err) {
      await this.transactionsRespository.update(transaction.id, {
        status: TransactionStatus.FAILED,
      });
      throw err;
    }
  }

  handleFailedPayment() {
    // update transaction
  }
}
