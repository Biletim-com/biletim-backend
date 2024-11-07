import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';

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
import { TransactionStatus } from '@app/common/enums';

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
  ) {}

  async handleSuccessfulPayment(
    _clientIp: string,
    paymentResultDto: BiletAllPaymentResultDto,
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

    try {
      if (paymentResultDto.result === false) {
        this.logger.error(
          `Fail in BiletAll 3DS payment -> ${paymentResultDto.message}`,
        );
        throw new BadRequestException(
          paymentResultDto.message || 'Error happened during 3DS',
        );
      }

      // update transaction status
      await queryRunner.manager.update(Transaction, transaction.id, {
        status: TransactionStatus.PROCESSING,
      });

      // update order and ticket numbers
      await queryRunner.manager.update(Order, transaction.order.id, {
        pnr: paymentResultDto.pnr,
      });
      await Promise.all(
        transaction.order.busTickets
          .sort((a, b) => a.ticketOrder - b.ticketOrder)
          .map((sortedBusTicket, index: number) =>
            queryRunner.manager.update(BusTicket, sortedBusTicket.id, {
              ticketNumber: paymentResultDto.ticketNumbers[index],
            }),
          ),
      );

      // update transaction status
      await queryRunner.manager.update(Transaction, transaction.id, {
        status: TransactionStatus.COMPLETED,
      });

      /** SEND EVENTS */
      // create invoice and ticket output
      // send email or SMS

      return transaction;
    } catch (err) {
      await this.transactionsRepository.update(transaction.id, {
        status: TransactionStatus.FAILED,
        errorMessage:
          err.message || 'Something went wrong while processing payment',
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
        order: {
          busTickets: true,
        },
      },
    });
    if (!transaction) {
      throw new TransactionNotFoundError();
    }

    await this.transactionsRepository.update(
      { id: transactionId },
      { status: TransactionStatus.FAILED, errorMessage },
    );
  }
}
