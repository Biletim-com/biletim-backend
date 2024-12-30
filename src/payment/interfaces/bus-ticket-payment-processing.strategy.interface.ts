import { QueryRunner } from 'typeorm';

// entites
import { Transaction } from '@app/modules/transactions/transaction.entity';

// dtos
import { BusTicketPurchaseResultDto } from '@app/providers/ticket/biletall/bus/dto/bus-ticket-purchase-result.dto';
import {
  VakifBankPaymentResultDto,
  VakifBankSavedCardPaymentFinishDto,
} from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';
import { BiletimGoPaymentResultDto } from '@app/providers/payment/biletim-go/dto/biletim-go-payment-result.dto';

export interface IBusTicketPaymentProcessingStrategy {
  handleTicketPayment(
    queryRunner: QueryRunner,
    clientIp: string,
    transaction: Transaction,
    paymentResultDetails:
      | BusTicketPurchaseResultDto
      | BiletimGoPaymentResultDto
      | VakifBankPaymentResultDto
      | VakifBankSavedCardPaymentFinishDto,
  ): Promise<void>;
}
