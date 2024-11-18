import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';
import { OrdersRepository } from '@app/modules/orders/orders.repository';

// interfaces
import { IPaymentResultHandler } from '@app/payment/interfaces/payment-result-handler.interface';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { Order } from '@app/modules/orders/order.entity';
import { BusTicket } from '@app/modules/tickets/bus/entities/bus-ticket.entity';

// dtos
import { BiletAllPaymentResultDto } from '@app/payment/dto/biletall-payment-result.dto';

// errors
import { TransactionNotFoundError } from '@app/common/errors';

// types
import { UUID } from '@app/common/types';

// enums
import { OrderStatus, TransactionStatus } from '@app/common/enums';

@Injectable()
export class BiletAllPaymentResultHandlerStrategy
  implements IPaymentResultHandler
{
  private readonly logger = new Logger(
    BiletAllPaymentResultHandlerStrategy.name,
  );

  constructor(
    private readonly dataSource: DataSource,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async handleSuccessfulPayment(
    _clientIp: string,
    { pnr, ticketNumbers, ...paymentResultDto }: BiletAllPaymentResultDto,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const transaction = await this.transactionsRepository.findOne({
      where: {
        id: paymentResultDto.transactionId,
      },
      relations: {
        order: {
          busTickets: {
            departureTerminal: true,
            arrivalTerminal: true,
          },
        },
      },
    });
    if (!transaction) {
      throw new TransactionNotFoundError();
    }
    // sort bus tickets based on order
    transaction.order.busTickets.sort((a, b) => a.ticketOrder - b.ticketOrder);

    try {
      if (paymentResultDto.result === false) {
        this.logger.error(
          `Fail in BiletAll 3DS payment -> ${paymentResultDto.message}`,
        );
        throw new BadRequestException(
          paymentResultDto.message || 'Error happened during 3DS',
        );
      }

      await Promise.all([
        ...transaction.order.busTickets.map(
          (sortedBusTicket, index: number) => {
            const ticketNumber = ticketNumbers[index];
            // update tickets for the data to return
            sortedBusTicket.ticketNumber = ticketNumber;

            return queryRunner.manager.update(BusTicket, sortedBusTicket.id, {
              ticketNumber,
            });
          },
        ),
        // update transaction status
        queryRunner.manager.update(Transaction, transaction.id, {
          status: TransactionStatus.COMPLETED,
        }),
        // update order status
        queryRunner.manager.update(Order, transaction.order.id, {
          status: OrderStatus.COMPLETED,
          pnr,
        }),
      ]);

      // update transaction and order for the data to return
      transaction.status = TransactionStatus.COMPLETED;
      transaction.order.status = OrderStatus.COMPLETED;
      transaction.order.pnr = pnr;

      /** SEND EVENTS */
      // create invoice and ticket output
      // send email or SMS

      await queryRunner.commitTransaction();
      return transaction;
    } catch (err) {
      this.transactionsRepository.update(transaction.id, {
        status: TransactionStatus.FAILED,
        errorMessage:
          err.message || 'Something went wrong while processing payment',
      });
      this.ordersRepository.update(transaction.order.id, {
        status: OrderStatus.PAYMENT_FAILED,
      });

      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async handleFailedPayment(transactionId: UUID, errorMessage?: string) {
    // update transaction
    const transaction = await this.transactionsRepository.findOne({
      where: {
        id: transactionId,
      },
      relations: {
        order: true,
      },
    });
    if (!transaction) {
      throw new TransactionNotFoundError();
    }

    Promise.all([
      this.transactionsRepository.update(
        { id: transactionId },
        { status: TransactionStatus.FAILED, errorMessage },
      ),
      this.ordersRepository.update(
        { id: transaction.order.id },
        { status: OrderStatus.PAYMENT_FAILED },
      ),
    ]);
  }
}
