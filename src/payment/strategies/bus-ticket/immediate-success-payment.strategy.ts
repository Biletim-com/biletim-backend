import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

// strategies
import { BaseBusTicketPaymentProcessingStrategy } from './base-bus-ticket-payment-processing.strategy';

// entties
import { Transaction } from '@app/modules/transactions/transaction.entity';

// interfaces
import { IBusTicketPaymentProcessingStrategy } from '../../interfaces/bus-ticket-payment-processing.strategy.interface';

// dtos
import { BusTicketPurchaseResultDto } from '@app/providers/ticket/biletall/bus/dto/bus-ticket-purchase-result.dto';

@Injectable()
export class ImmediateSuccessPaymentStrategy
  extends BaseBusTicketPaymentProcessingStrategy
  implements IBusTicketPaymentProcessingStrategy
{
  async handleTicketPayment(
    queryRunner: QueryRunner,
    _clientIp: string,
    transaction: Transaction,
    paymentResultDetail: BusTicketPurchaseResultDto,
  ): Promise<void> {
    const { pnr, ticketNumbers } = paymentResultDetail;

    await this.updateDatabaseWithPaymentResults(
      queryRunner,
      transaction,
      ticketNumbers,
      pnr,
    );
  }
}
