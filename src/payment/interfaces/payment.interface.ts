import { BankCardDto } from '@app/common/dtos';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { VakifBankPaymentResultDto } from '../dto/vakif-bank-payment-result.dto';
import { UUID } from '@app/common/types';
import { TicketType } from '@app/common/enums';

export interface IPayment {
  startPayment(
    clientIp: string,
    ticketType: TicketType,
    bankCard: BankCardDto,
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
