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
import { OrderStatus, TransactionStatus } from '@app/common/enums';
import { threeDSecureResponse } from './constants/3d-response.constant';
import { BusSeatAvailabilityRequestDto } from '@app/modules/tickets/bus/dto/bus-seat-availability.dto';

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
    transaction.order.busTickets.sort((a, b) => a.ticketOrder - b.ticketOrder);

    const actionsCompleted: Array<'PAYMENT' | 'TICKET_SALE'> = [];

    try {
      if (paymentResultDto.Status !== 'Y') {
        const { description, detail } =
          threeDSecureResponse[paymentResultDto.ErrorCode];
        this.logger.error({ description, detail });
        throw new BadRequestException(paymentResultDto.ErrorMessage);
      }

      const {
        companyNo,
        routeNumber,
        tripTrackingNumber,
        departureTerminal,
        arrivalTerminal,
        travelStartDateTime,
      } = transaction.order.busTickets[0];

      /**
       * check ticket validity against biletall
       */
      const busSeatAvailabilityDto = new BusSeatAvailabilityRequestDto({
        companyNo,
        routeNumber,
        tripTrackingNumber,
        departurePointId: String(departureTerminal.externalId),
        arrivalPointId: String(arrivalTerminal.externalId),
        travelStartDateTime,
        seats: transaction.order.busTickets,
      });

      const busSeatAvailability =
        await this.biletAllBusService.busSeatAvailability(
          clientIp,
          busSeatAvailabilityDto,
        );

      if (!busSeatAvailability.isAvailable) {
        throw new BadRequestException('Seat(s) are not available anymore');
      }

      // update transaction and status
      await Promise.all([
        queryRunner.manager.update(Transaction, transaction.id, {
          status: TransactionStatus.PROCESSING,
        }),
        queryRunner.manager.update(Order, transaction.order.id, {
          status: OrderStatus.PAYMENT_INITIATED,
        }),
      ]);

      // finalize payment
      await this.vakifBankPaymentStrategy.finishPayment(
        clientIp,
        {
          ...paymentResultDto,
          PurchAmount: transaction.amount,
        },
        transaction.order.id,
      );
      actionsCompleted.push('PAYMENT');

      // update order status
      await queryRunner.manager.update(Order, transaction.order.id, {
        status: OrderStatus.AWAITING,
      });
      // send purchase request to biletall
      const { pnr, ticketNumbers } = await this.biletAllBusService.saleRequest(
        clientIp,
        transaction,
        transaction.order,
        transaction.order.busTickets,
      );
      actionsCompleted.push('TICKET_SALE');

      await Promise.all([
        ...transaction.order.busTickets.map(
          (sortedBusTicket, index: number) => {
            const ticketNumber = ticketNumbers[index];
            // update tickets for the data to return
            sortedBusTicket.ticketNumber = ticketNumber;

            // update ticket numbers
            return queryRunner.manager.update(BusTicket, sortedBusTicket.id, {
              ticketNumber,
            });
          },
        ),
        queryRunner.manager.update(Transaction, transaction.id, {
          status: TransactionStatus.COMPLETED,
        }),
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
      await queryRunner.rollbackTransaction();

      await this.transactionsRepository.update(transaction.id, {
        status: TransactionStatus.FAILED,
        errorMessage:
          err.message || 'Something went wrong while processing payment',
      });

      // TODO: this should be sent to a queue
      if (actionsCompleted.includes('PAYMENT')) {
        this.vakifBankPaymentStrategy.cancelPayment(clientIp, transaction);
      }
      if (actionsCompleted.includes('TICKET_SALE')) {
        console.log('cancel with PNR number');
      }
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
