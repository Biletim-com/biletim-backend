import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

// services
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';
import { VakifBankPaymentStrategy } from './vakif-bank-payment.strategy';
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';
import { BiletAllBusSearchService } from '@app/providers/ticket/biletall/bus/services/biletall-bus-search.service';

// interfaces
import { IPaymentResultHandler } from '@app/payment/interfaces/payment-result-handler.interface';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { Order } from '@app/modules/orders/order.entity';
import { BusTicket } from '@app/modules/tickets/bus/entities/bus-ticket.entity';
import { PlaneTicket } from '@app/modules/tickets/plane/entities/plane-ticket.entity';

// dtos
import { VakifBankPaymentResultDto } from '../../dto/vakif-bank-payment-result.dto';

// errors
import { TransactionNotFoundError } from '@app/common/errors';

// types
import { UUID } from '@app/common/types';

// enums
import {
  OrderStatus,
  PlaneTicketOperationType,
  TransactionStatus,
} from '@app/common/enums';

// constants
import { threeDSecureResponse } from './constants/3d-response.constant';

// dto
import { BusSeatAvailabilityRequestDto } from '@app/modules/tickets/bus/dto/bus-seat-availability.dto';
import { BiletAllBusTicketPurchaseService } from '@app/providers/ticket/biletall/bus/services/biletall-bus-ticket-purchase.service';
import { BiletAllPlaneTicketPurchaseService } from '@app/providers/ticket/biletall/plane/services/biletall-plane-ticket-purchase.service';

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
    private readonly eventEmitterService: EventEmitterService,
    private readonly biletAllBusSearchService: BiletAllBusSearchService,
    private readonly biletAllBusTicketPurchaseService: BiletAllBusTicketPurchaseService,
    private readonly biletAllPlaneTicketPurchaseService: BiletAllPlaneTicketPurchaseService,
  ) {}

  async handleSuccessfulBusTicketPayment(
    clientIp: string,
    paymentResultDto: VakifBankPaymentResultDto,
  ): Promise<Transaction> {
    if (paymentResultDto.Status !== 'Y') {
      const { description, detail } =
        threeDSecureResponse[paymentResultDto.ErrorCode];
      this.logger.error({ description, detail });
      throw new BadRequestException(paymentResultDto.ErrorMessage);
    }

    const transaction = await this.transactionsRepository.findOne({
      where: {
        id: paymentResultDto.VerifyEnrollmentRequestId,
      },
      relations: {
        order: {
          busTickets: {
            departureTerminal: true,
            arrivalTerminal: true,
            passenger: true,
          },
        },
      },
    });
    if (!transaction) {
      throw new TransactionNotFoundError();
    }
    transaction.order.busTickets.sort((a, b) => a.ticketOrder - b.ticketOrder);

    const actionsCompleted: Array<'PAYMENT' | 'TICKET_SALE'> = [];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        companyNumber,
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
        companyNumber,
        routeNumber,
        tripTrackingNumber,
        departurePointId: String(departureTerminal.externalId),
        arrivalPointId: String(arrivalTerminal.externalId),
        travelStartDateTime,
        seats: transaction.order.busTickets.map((busTicket) => ({
          gender: busTicket.passenger.gender,
          seatNumber: busTicket.seatNumber,
        })),
      });

      const busSeatAvailability =
        await this.biletAllBusSearchService.busSeatAvailability(
          clientIp,
          busSeatAvailabilityDto,
        );

      if (!busSeatAvailability.isAvailable) {
        throw new BadRequestException('Seat(s) are not available anymore');
      }

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

      // send purchase request to biletall
      const { pnr, ticketNumbers } =
        await this.biletAllBusTicketPurchaseService.purchaseTicket(
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
      this.eventEmitterService.emitEvent(
        'ticket.bus.purchased',
        transaction.order,
      );
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

  /**
   * Handles Successfull VakifBank 3DS response
   * @param clientIp ClientIP
   * @param paymentResultDto VakifBank 3DS response
   * @returns Transaction
   */
  async handleSuccessfulPlaneTicketPayment(
    clientIp: string,
    paymentResultDto: VakifBankPaymentResultDto,
  ): Promise<Transaction> {
    if (paymentResultDto.Status !== 'Y') {
      const { description, detail } =
        threeDSecureResponse[paymentResultDto.ErrorCode];
      this.logger.error({ description, detail });
      throw new BadRequestException(paymentResultDto.ErrorMessage);
    }

    const transaction = await this.transactionsRepository.findOne({
      where: {
        id: paymentResultDto.VerifyEnrollmentRequestId,
      },
      relations: {
        order: {
          planeTickets: {
            passenger: true,
            segments: {
              departureAirport: true,
              arrivalAirport: true,
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new TransactionNotFoundError();
    }
    transaction.order.planeTickets.sort(
      (a, b) => a.ticketOrder - b.ticketOrder,
    );
    transaction.order.planeTickets.forEach((planeTicket) =>
      planeTicket.segments.sort((a, b) => a.segmentOrder - b.segmentOrder),
    );

    const actionsCompleted: Array<'PAYMENT' | 'TICKET_SALE'> = [];

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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

      // send purchase request to biletall
      const { pnr, ticketNumbers } =
        await this.biletAllPlaneTicketPurchaseService.processPlaneTicket(
          clientIp,
          PlaneTicketOperationType.PURCHASE,
          transaction.amount,
          transaction.order,
          transaction.order.planeTickets,
          transaction.order.planeTickets[0].segments,
        );
      actionsCompleted.push('TICKET_SALE');

      await Promise.all([
        ...transaction.order.planeTickets.map(
          (sortedPlaneTicket, index: number) => {
            const ticketNumber = ticketNumbers[index];
            // update tickets for the data to return
            sortedPlaneTicket.ticketNumber = ticketNumber;

            // update ticket numbers
            return queryRunner.manager.update(
              PlaneTicket,
              sortedPlaneTicket.id,
              {
                ticketNumber,
              },
            );
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
      this.eventEmitterService.emitEvent(
        'ticket.plane.purchased',
        transaction.order,
      );
      // send email or SMS

      await queryRunner.commitTransaction();
      return transaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      const errorMessage =
        err.message || 'Something went wrong while processing payment';

      await this.transactionsRepository.update(transaction.id, {
        status: TransactionStatus.FAILED,
        errorMessage,
      });

      // TODO: this should be sent to a queue
      if (actionsCompleted.includes('PAYMENT')) {
        this.vakifBankPaymentStrategy.cancelPayment(clientIp, transaction);
      }
      if (actionsCompleted.includes('TICKET_SALE')) {
        console.log('cancel with PNR number');
      }
      err.message = errorMessage;
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
