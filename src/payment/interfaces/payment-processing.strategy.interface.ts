// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';

// dto
import { BusTicketPurchaseResultDto } from '@app/providers/ticket/biletall/bus/dto/bus-ticket-purchase-result.dto';
import { BiletimGoPaymentResultDto } from '@app/providers/payment/biletim-go/dto/biletim-go-payment-result.dto';
import {
  VakifBankPaymentResultDto,
  VakifBankSavedCardPaymentFinishDto,
} from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';

// types
import { UUID } from '@app/common/types';

export interface IPaymentProcessingStrategy {
  handlePayment(
    clientIp: string,
    transactionId: UUID,
    paymentResultDto:
      | BusTicketPurchaseResultDto
      | BiletimGoPaymentResultDto
      | VakifBankPaymentResultDto
      | VakifBankSavedCardPaymentFinishDto,
  ): Promise<Transaction>;

  handlePaymentFailure(
    transactionOrTransactionId: Transaction | UUID,
    errorMessage?: string,
  ): Promise<void>;
}
