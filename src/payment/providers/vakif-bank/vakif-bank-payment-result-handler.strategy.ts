import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';
import { VakifBankPaymentStrategy } from './vakif-bank-payment.strategy';

// interfaces
import { IPaymentResultHandler } from '@app/payment/interfaces/payment-result-handler.interface';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { Order } from '@app/modules/orders/order.entity';
import { BusTicket } from '@app/modules/tickets/bus/entities/bus-ticket.entity';

// services
import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';

// dtos
import { VakifBankPaymentResultDto } from '../../dto/vakif-bank-payment-result.dto';

// errors
import { TransactionNotFoundError } from '@app/common/errors';

// types
import { UUID } from '@app/common/types';

// enums
import { TransactionStatus } from '@app/common/enums';
import { threeDSecureResponse } from './constants/3d-response.constant';

@Injectable()
export class VakifBankPaymentResultHandlerStrategy
  implements IPaymentResultHandler
{
  private readonly logger = new Logger(
    VakifBankPaymentResultHandlerStrategy.name,
  );

  constructor(
    private readonly dataSource: DataSource,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly vakifBankPaymentStrategy: VakifBankPaymentStrategy,
    private readonly biletAllBusService: BiletAllBusService,
  ) {}

  async handleSuccessfulPayment(
    clientIp: string,
    paymentResultDto: VakifBankPaymentResultDto,
  ): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const transaction = await this.transactionsRepository.findOne({
      where: {
        id: paymentResultDto.VerifyEnrollmentRequestId,
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

    console.log({ transaction: JSON.stringify(transaction, null, 2) });

    const actionsCompleted: Array<'PAYMENT' | 'TICKET_SALE'> = [];

    try {
      if (paymentResultDto.Status !== 'Y') {
        const { description, detail } =
          threeDSecureResponse[paymentResultDto.ErrorCode];
        this.logger.error({ description, detail });
        throw new BadRequestException(paymentResultDto.ErrorMessage);
      }

      // /**
      //  * check ticket validity against biletall
      //  */
      // const busSeatAvailabilityDto = new BusSeatAvailabilityRequestDto({
      //   ...busTicketPurchaseDto,
      //   departurePointId: departureTerminal.externalId,
      //   arrivalPointId: arrivalTerminal.externalId,
      //   seats: transaction.order.busTickets,
      //   ip: '127.0.0.1',
      // });

      // const busSeatAvailability =
      //   await this.biletAllBusService.busSeatAvailability(busSeatAvailabilityDto);

      // if (!busSeatAvailability.isAvailable) {
      //   throw new BadRequestException('Seat(s) are not available anymore');
      // }

      // update transaction status
      await queryRunner.manager.update(Transaction, transaction.id, {
        status: TransactionStatus.PROCESSING,
      });

      // finalize payment
      await this.vakifBankPaymentStrategy.finishPayment(
        clientIp,
        {
          ...paymentResultDto,
          PurchAmount: String(transaction.amount),
        },
        transaction.order.id,
      );
      actionsCompleted.push('PAYMENT');

      // send purchase request to biletall
      const { pnr, ticketNumbers } = await this.biletAllBusService.saleRequest(
        clientIp,
        transaction,
        transaction.order,
        transaction.order.busTickets,
      );
      actionsCompleted.push('TICKET_SALE');

      // update order and ticket numbers
      await queryRunner.manager.update(Order, transaction.order.id, { pnr });
      await Promise.all(
        transaction.order.busTickets
          .sort((a, b) => a.ticketOrder - b.ticketOrder)
          .map((sortedBusTicket, index: number) =>
            queryRunner.manager.update(BusTicket, sortedBusTicket.id, {
              ticketNumber: ticketNumbers[index],
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
      console.log({ err });
      await this.transactionsRepository.update(transaction.id, {
        status: TransactionStatus.FAILED,
        errorMessage:
          err.message || 'Something went wrong while processing payment',
      });

      // TODO: this should be sent to a queue
      if (actionsCompleted.includes('PAYMENT')) {
        const cancelPayment = await this.vakifBankPaymentStrategy.cancelPayment(
          clientIp,
          transaction,
        );
        console.log({ cancelPayment });
      }

      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async handleFailedPayment(transactionId: UUID, errorMessage?: string) {
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
