import { CreditCardDto } from '@app/common/dtos';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { PaymentResultDto } from '../dto/payment-result.dto';
import { UUID } from '@app/common/types';

export interface IPayment {
  startPayment(
    creditCard: CreditCardDto,
    transaction: Transaction,
  ): Promise<string>;
  finishPayment(
    paymentDetailsDto: PaymentResultDto,
    orderId: UUID,
  ): Promise<any>;
  cancelPayment(): Promise<void>;
  refundPayment(): Promise<void>;
}
