import { QueryRunner } from 'typeorm';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { BusTicket } from '@app/modules/orders/bus-ticket/entities/bus-ticket.entity';
import { BusTicketOrder } from '@app/modules/orders/bus-ticket/entities/bus-ticket-order.entity';

// enums
import { OrderStatus, TransactionStatus } from '@app/common/enums';

export abstract class BaseBusTicketPaymentProcessingStrategy {
  protected async updateDatabaseWithPaymentResults(
    queryRunner: QueryRunner,
    transaction: Transaction,
    ticketNumbers: string[],
    pnr: string,
  ): Promise<void> {
    await Promise.all([
      ...transaction.busTicketOrder.tickets.map((ticket, index: number) => {
        const ticketNumber = ticketNumbers[index];
        // update tickets for the data to return
        ticket.ticketNumber = ticketNumber;
        // update ticket numbers
        return queryRunner.manager.update(BusTicket, ticket.id, {
          ticketNumber,
        });
      }),
      // update transaction status
      queryRunner.manager.update(Transaction, transaction.id, {
        status: TransactionStatus.COMPLETED,
      }),
      // update order status
      queryRunner.manager.update(
        BusTicketOrder,
        transaction.busTicketOrder.id,
        {
          status: OrderStatus.COMPLETED,
          pnr,
        },
      ),
    ]);

    transaction.status = TransactionStatus.COMPLETED;
    transaction.busTicketOrder.status = OrderStatus.COMPLETED;
    transaction.busTicketOrder.pnr = pnr;
  }
}
