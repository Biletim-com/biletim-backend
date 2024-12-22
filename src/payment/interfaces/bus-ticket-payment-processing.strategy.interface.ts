import { QueryRunner } from 'typeorm';

// entites
import { Transaction } from '@app/modules/transactions/transaction.entity';

// dtos
import { BusTicketPurchaseResultDto } from '@app/providers/ticket/biletall/bus/dto/bus-ticket-purchase-result.dto';
import { VakifBankPaymentResultDto } from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';

export interface IBusTicketPaymentProcessingStrategy {
  handleTicketPayment(
    queryRunner: QueryRunner,
    clientIp: string,
    transaction: Transaction,
    paymentResultDetails:
      | BusTicketPurchaseResultDto
      | VakifBankPaymentResultDto,
  ): Promise<void>;
}
