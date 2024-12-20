import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { EventEmitterService } from '@app/providers/event-emitter/provider.service';

import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';
import { BusTicketOrdersRepository } from '@app/modules/orders/bus-ticket/bus-ticket-orders.repository';

// interfaces
import { IPaymentResultHandler } from '@app/payment/interfaces/payment-result-handler.interface';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { BusTicket } from '@app/modules/orders/bus-ticket/entities/bus-ticket.entity';
import { BusTicketOrder } from '@app/modules/orders/bus-ticket/entities/bus-ticket-order.entity';

// dtos
import { BiletAllPaymentResultDto } from '@app/payment/dto/biletall-payment-result.dto';

// errors
import { TransactionNotFoundError } from '@app/common/errors';

// types
import { UUID } from '@app/common/types';

// enums
import { OrderStatus, TransactionStatus } from '@app/common/enums';
import { VakifBankPaymentResultDto } from '@app/payment/dto/vakif-bank-payment-result.dto';

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
    private readonly busTicketOrdersRepository: BusTicketOrdersRepository,
    private readonly eventEmitterService: EventEmitterService,
  ) {}

  async handleSuccessfulBusTicketPayment(
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
        busTicketOrder: {
          departureTerminal: true,
          arrivalTerminal: true,
        },
      },
    });
    if (!transaction) {
      throw new TransactionNotFoundError();
    }
    // sort bus tickets based on order
    transaction.busTicketOrder.tickets.sort(
      (a, b) => a.ticketOrder - b.ticketOrder,
    );

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
        ...transaction.busTicketOrder.tickets.map(
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
        queryRunner.manager.update(
          BusTicketOrder,
          transaction.busTicketOrder.id,
          {
            status: OrderStatus.COMPLETED,
            pnr,
          },
        ),
      ]);

      // update transaction and order for the data to return
      transaction.status = TransactionStatus.COMPLETED;
      transaction.busTicketOrder.status = OrderStatus.COMPLETED;
      transaction.busTicketOrder.pnr = pnr;

      /** SEND EVENTS */
      this.eventEmitterService.emitEvent(
        'ticket.bus.purchased',
        transaction.busTicketOrder,
      );
      // send email or SMS

      await queryRunner.commitTransaction();
      return transaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      const errorMessage =
        err.message || 'Something went wrong while processing payment';

      this.transactionsRepository.update(transaction.id, {
        status: TransactionStatus.FAILED,
        errorMessage,
      });
      this.busTicketOrdersRepository.update(transaction.busTicketOrder.id, {
        status: OrderStatus.PAYMENT_FAILED,
      });

      err.message = errorMessage;
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
        busTicketOrder: true,
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
      this.busTicketOrdersRepository.update(
        { id: transaction.busTicketOrder.id },
        { status: OrderStatus.PAYMENT_FAILED },
      ),
    ]);
  }

  handleSuccessfulPlaneTicketPayment(
    clientIp: string,
    paymentResultDto: BiletAllPaymentResultDto | VakifBankPaymentResultDto,
  ): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  handleSuccessfulHotelBookingPayment(
    clientIp: string,
    paymentResultDto: VakifBankPaymentResultDto | BiletAllPaymentResultDto,
  ): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }
}
