import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

// services
import { VakifBankPaymentStrategy } from '@app/providers/payment/vakif-bank/vakif-bank-payment.strategy';
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';
import { BiletAllBusSearchService } from '@app/providers/ticket/biletall/bus/services/biletall-bus-search.service';

// repositories
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';
import { BusTicketOrdersRepository } from '@app/modules/orders/bus-ticket/bus-ticket-orders.repository';
import { PlaneTicketOrdersRepository } from '@app/modules/orders/plane-ticket/plane-ticket-orders.repository';
import { HotelBookingOrdersRepository } from '@app/modules/orders/hotel-booking/hotel-booking-orders.repository';

// interfaces
import { IPaymentResultHandler } from '@app/payment/interfaces/payment-result-handler.interface';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { BusTicket } from '@app/modules/orders/bus-ticket/entities/bus-ticket.entity';
import { BusTicketOrder } from '@app/modules/orders/bus-ticket/entities/bus-ticket-order.entity';
import { HotelBookingOrder } from '@app/modules/orders/hotel-booking/entities/hotel-booking-order.entity';
import { PlaneTicket } from '@app/modules/orders/plane-ticket/entities/plane-ticket.entity';
import { PlaneTicketOrder } from '@app/modules/orders/plane-ticket/entities/plane-ticket-order.entity';

// dtos
import { VakifBankPaymentResultDto } from '../dto/vakif-bank-payment-result.dto';

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
import { threeDSecureResponse } from '@app/providers/payment/vakif-bank/constants/3d-response.constant';

// dto
import { BusSeatAvailabilityRequestDto } from '@app/search/bus/dto/bus-seat-availability.dto';
import { BiletAllBusTicketPurchaseService } from '@app/providers/ticket/biletall/bus/services/biletall-bus-ticket-purchase.service';
import { BiletAllPlaneTicketPurchaseService } from '@app/providers/ticket/biletall/plane/services/biletall-plane-ticket-purchase.service';
import { RatehawkOrderBookingService } from '@app/providers/hotel/ratehawk/services/ratehawk-order-booking.service';

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
    private readonly busTicketOrdersRepository: BusTicketOrdersRepository,
    private readonly planeTicketOrdersRepository: PlaneTicketOrdersRepository,
    private readonly hotelBookingOrdersRepository: HotelBookingOrdersRepository,
    private readonly vakifBankPaymentStrategy: VakifBankPaymentStrategy,
    private readonly eventEmitterService: EventEmitterService,
    private readonly biletAllBusSearchService: BiletAllBusSearchService,
    private readonly biletAllBusTicketPurchaseService: BiletAllBusTicketPurchaseService,
    private readonly biletAllPlaneTicketPurchaseService: BiletAllPlaneTicketPurchaseService,
    private readonly ratehawkOrderBookingService: RatehawkOrderBookingService,
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
        busTicketOrder: {
          departureTerminal: true,
          arrivalTerminal: true,
          tickets: {
            passenger: true,
          },
        },
      },
    });
    if (!transaction) {
      throw new TransactionNotFoundError();
    }
    transaction.busTicketOrder.tickets.sort(
      (a, b) => a.ticketOrder - b.ticketOrder,
    );

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
      } = transaction.busTicketOrder;

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
        seats: transaction.busTicketOrder.tickets.map((ticket) => ({
          gender: ticket.passenger.gender,
          seatNumber: ticket.seatNumber,
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
        transaction.busTicketOrder.id,
      );
      actionsCompleted.push('PAYMENT');

      // send purchase request to biletall
      const { pnr, ticketNumbers } =
        await this.biletAllBusTicketPurchaseService.purchaseTicket(
          clientIp,
          transaction,
          transaction.busTicketOrder,
          transaction.busTicketOrder.tickets,
        );
      actionsCompleted.push('TICKET_SALE');

      await Promise.all([
        ...transaction.busTicketOrder.tickets.map(
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

      await queryRunner.commitTransaction();
      return transaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      Promise.all([
        this.transactionsRepository.update(transaction.id, {
          status: TransactionStatus.FAILED,
          errorMessage:
            err.message || 'Something went wrong while processing payment',
        }),
        this.busTicketOrdersRepository.update(
          { id: transaction.busTicketOrder.id },
          { status: OrderStatus.PAYMENT_FAILED },
        ),
      ]);

      // TODO: this should be sent to a queue
      if (actionsCompleted.includes('PAYMENT')) {
        this.vakifBankPaymentStrategy.cancelPayment(clientIp, transaction.id);
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
        planeTicketOrder: {
          tickets: {
            passenger: true,
          },
          segments: {
            departureAirport: true,
            arrivalAirport: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new TransactionNotFoundError();
    }
    transaction.planeTicketOrder.tickets.sort(
      (a, b) => a.ticketOrder - b.ticketOrder,
    );
    transaction.planeTicketOrder.segments.sort(
      (a, b) => a.segmentOrder - b.segmentOrder,
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
        transaction.planeTicketOrder.id,
      );
      actionsCompleted.push('PAYMENT');

      // send purchase request to biletall
      const { pnr, ticketNumbers } =
        await this.biletAllPlaneTicketPurchaseService.processPlaneTicket(
          clientIp,
          PlaneTicketOperationType.PURCHASE,
          transaction.amount,
          transaction.planeTicketOrder,
          transaction.planeTicketOrder.tickets,
          transaction.planeTicketOrder.segments,
        );
      actionsCompleted.push('TICKET_SALE');

      await Promise.all([
        ...transaction.planeTicketOrder.tickets.map(
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
        queryRunner.manager.update(
          PlaneTicketOrder,
          transaction.planeTicketOrder.id,
          {
            status: OrderStatus.COMPLETED,
            pnr,
          },
        ),
      ]);

      // update transaction and order for the data to return
      transaction.status = TransactionStatus.COMPLETED;
      transaction.planeTicketOrder.status = OrderStatus.COMPLETED;
      transaction.planeTicketOrder.pnr = pnr;

      /** SEND EVENTS */
      this.eventEmitterService.emitEvent(
        'ticket.plane.purchased',
        transaction.planeTicketOrder,
      );
      // send email or SMS

      await queryRunner.commitTransaction();
      return transaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      const errorMessage =
        err.message || 'Something went wrong while processing payment';

      Promise.all([
        this.transactionsRepository.update(transaction.id, {
          status: TransactionStatus.FAILED,
          errorMessage,
        }),
        this.planeTicketOrdersRepository.update(
          { id: transaction.planeTicketOrder.id },
          { status: OrderStatus.PAYMENT_FAILED },
        ),
      ]);

      // TODO: this should be sent to a queue
      if (actionsCompleted.includes('PAYMENT')) {
        this.vakifBankPaymentStrategy.cancelPayment(clientIp, transaction.id);
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

  async handleSuccessfulHotelBookingPayment(
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
        hotelBookingOrder: {
          rooms: {
            guests: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new TransactionNotFoundError();
    }

    const actionsCompleted: Array<'PAYMENT' | 'HOTEL_BOOKING'> = [];

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
        transaction.hotelBookingOrder.id,
      );
      actionsCompleted.push('PAYMENT');

      // send purchase request to biletall
      await this.ratehawkOrderBookingService.orderBookingFinish({
        language: 'en',
        partner: {
          partnerOrderId:
            transaction.hotelBookingOrder.reservationNumber.toString(),
        },
        paymentType: transaction.hotelBookingOrder.paymentType,
        rooms: transaction.hotelBookingOrder.rooms,
        upsellData: transaction.hotelBookingOrder.upsell,
        user: {
          email: 'test@mail.com',
          phone: '5550240045',
        },
        supplierData: {
          firstNameOriginal:
            transaction.hotelBookingOrder.rooms[0].guests[0].firstName,
          lastNameOriginal:
            transaction.hotelBookingOrder.rooms[0].guests[0].lastName,
          email: transaction.hotelBookingOrder.userEmail,
          phone: transaction.hotelBookingOrder.userPhoneNumber,
        },
      });
      actionsCompleted.push('HOTEL_BOOKING');

      await Promise.all([
        queryRunner.manager.update(Transaction, transaction.id, {
          status: TransactionStatus.COMPLETED,
        }),
        queryRunner.manager.update(
          HotelBookingOrder,
          transaction.hotelBookingOrder.id,
          {
            status: OrderStatus.AWAITING,
          },
        ),
      ]);

      // update transaction and order for the data to return
      transaction.status = TransactionStatus.COMPLETED;
      transaction.hotelBookingOrder.status = OrderStatus.AWAITING;

      await queryRunner.commitTransaction();
      return transaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      const errorMessage =
        err.message || 'Something went wrong while processing payment';

      Promise.all([
        this.transactionsRepository.update(transaction.id, {
          status: TransactionStatus.FAILED,
          errorMessage,
        }),
        this.hotelBookingOrdersRepository.update(
          transaction.hotelBookingOrder.id,
          {
            status: OrderStatus.PAYMENT_FAILED,
          },
        ),
      ]);

      // TODO: this should be sent to a queue
      if (actionsCompleted.includes('PAYMENT')) {
        this.vakifBankPaymentStrategy.cancelPayment(clientIp, transaction.id);
      }
      if (actionsCompleted.includes('HOTEL_BOOKING')) {
        console.log('cancel with order id');
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
