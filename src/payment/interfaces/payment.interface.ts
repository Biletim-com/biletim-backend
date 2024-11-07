import { CreditCardDto } from '@app/common/dtos';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { VakifBankPaymentResultDto } from '../dto/vakif-bank-payment-result.dto';
import { UUID } from '@app/common/types';

export interface IPayment {
  startPayment(
    clientIp: string,
    creditCard: CreditCardDto,
    transaction: Transaction,
  ): Promise<string>;
  finishPayment(
    clientIp: string,
    paymentDetailsDto: VakifBankPaymentResultDto,
    orderId: UUID,
  ): Promise<any>;
  cancelPayment(
    clientIp: string,
    transactionOrTransactionId: UUID | Transaction,
  ): Promise<any>;
  refundPayment(
    clientIp: string,
    transactionOrTransactionId: UUID | Transaction,
  ): Promise<any>;
}
