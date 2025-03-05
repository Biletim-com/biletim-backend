import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';

// services
import { BiletAllBusSearchService } from '@app/providers/ticket/biletall/bus/services/biletall-bus-search.service';
import { AbstractStartPaymentService } from '../abstract/start-payment.abstract.service';
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';

// factories
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';

// repositories
import { UsersRepository } from '@app/modules/users/users.repository';

// entities
import { BusTicketOrder } from '@app/modules/orders/bus-ticket/entities/bus-ticket-order.entity';
import { BusTicket } from '@app/modules/orders/bus-ticket/entities/bus-ticket.entity';
import { BusTicketPassenger } from '@app/modules/orders/bus-ticket/entities/bus-ticket-passenger.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { BusTerminal } from '@app/providers/ticket/biletall/bus/entities/bus-terminal.entity';
import { User } from '@app/modules/users/user.entity';

// enums
import {
  Currency,
  OrderCategory,
  OrderStatus,
  OrderType,
  PaymentProvider,
  PaymentFlowType,
} from '@app/common/enums';

// dtos
import { BusTicketPurchaseDto } from '../dto/bus-ticket-purchase.dto';
import { BusSeatAvailabilityRequestDto } from '@app/search/bus/dto/bus-seat-availability.dto';

// types
import { UUID } from '@app/common/types';

// errors
import { ServiceError } from '@app/common/errors';

// utils
import { normalizeDecimal } from '@app/common/utils';

@Injectable()
export class BusTicketStartPaymentService extends AbstractStartPaymentService {
  constructor(
    usersRepository: UsersRepository,
    eventEmitter: EventEmitterService,
    paymentProviderFactory: PaymentProviderFactory,
    private readonly dataSource: DataSource,
    private readonly biletAllBusSearchService: BiletAllBusSearchService,
  ) {
    super(usersRepository, eventEmitter, paymentProviderFactory);
  }

  async busTicketPurchase(
    busTicketPurchaseDto: BusTicketPurchaseDto,
    clientIp: string,
    user?: User,
  ): Promise<{ transactionId: UUID; htmlContent: string | null }> {
    const paymentMethod = await this.validatePaymentMethod(
      busTicketPurchaseDto.paymentMethod,
      user,
    );

    const trip = busTicketPurchaseDto.trip;

    const terminals = await this.dataSource.getRepository(BusTerminal).findBy({
      externalId: In([trip.departureTerminalId, trip.arrivalTerminalId]),
    });

    const departureTerminal = terminals.find(
      (terminal) => terminal.externalId === Number(trip.departureTerminalId),
    );
    const arrivalTerminal = terminals.find(
      (terminal) => terminal.externalId === Number(trip.arrivalTerminalId),
    );

    if (!departureTerminal || !arrivalTerminal) {
      throw new ServiceError('Bus Terminal(s) do not exist');
    }

    /**
     * Validate Company via company number
     */
    const [company] = await this.biletAllBusSearchService.companies({
      companyNumber: trip.companyNumber,
    });
    if (!company) {
      throw new ServiceError('Company does not exist');
    }

    /**
     * check ticket validity against biletall
     */
    const busSeatAvailabilityDto = new BusSeatAvailabilityRequestDto({
      companyNumber: trip.companyNumber,
      routeNumber: trip.routeNumber,
      travelStartDateTime: trip.travelStartDateTime,
      tripTrackingNumber: trip.tripTrackingNumber,
      departurePointId: String(departureTerminal.externalId),
      arrivalPointId: String(arrivalTerminal.externalId),
      seats: busTicketPurchaseDto.passengers,
    });

    const busSeatAvailability =
      await this.biletAllBusSearchService.busSeatAvailability(
        clientIp,
        busSeatAvailabilityDto,
      );

    if (!busSeatAvailability.isAvailable) {
      throw new ServiceError('Seat(s) are not available anymore');
    }

    const { canSellToForeigners, transactionRules } =
      await this.biletAllBusSearchService.getForeignSaleEligibilityAndTransactionRules(
        clientIp,
        busSeatAvailabilityDto,
      );

    if (
      !canSellToForeigners &&
      busTicketPurchaseDto.passengersWithoutTcNumberExists
    ) {
      throw new ServiceError(
        'This company does not sell tickets to passengers without TC number',
      );
    }

    if (transactionRules.length === 0) {
      throw new ServiceError('This company does not accept online payments');
    }

    const paymentProviderType = busTicketPurchaseDto.paymentMethod.useWallet
      ? PaymentProvider.BILETIM_GO
      : transactionRules.includes('INTERNAL_VIRTUAL_POS')
      ? PaymentProvider.VAKIF_BANK
      : PaymentProvider.BILET_ALL;
    if (
      !paymentMethod.bankCard &&
      paymentProviderType === PaymentProvider.BILET_ALL
    ) {
      throw new ServiceError(
        'You must start the payment with bank card details',
      );
    }

    const totalTicketPrice = normalizeDecimal(
      busTicketPurchaseDto.passengers.reduce((acc, current) => {
        return acc + Number(current.ticketPrice);
      }, 0),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      /**
       * Start DB transaction
       */
      await queryRunner.connect();
      await queryRunner.startTransaction();

      /**
       * Init Transactions
       */
      const transaction = this.composeTransaction(
        totalTicketPrice,
        paymentProviderType,
        paymentMethod,
      );
      await queryRunner.manager.insert(Transaction, transaction);

      /**
       * Compose Invoice fields
       */
      const invoice = busTicketPurchaseDto.invoice
        ? this.composeOrderInvoice(busTicketPurchaseDto.invoice)
        : null;

      /**
       * Create Order
       */
      const order = new BusTicketOrder({
        userEmail: busTicketPurchaseDto.email,
        userPhoneNumber: busTicketPurchaseDto.phoneNumber,
        companyNumber: trip.companyNumber,
        companyName: company.companyName,
        routeNumber: trip.routeNumber,
        tripTrackingNumber: busSeatAvailabilityDto.tripTrackingNumber,
        travelStartDateTime: trip.travelStartDateTime,
        departureTerminal,
        arrivalTerminal,
        type: OrderType.BUS_TICKET,
        category: OrderCategory.PURCHASE,
        status: OrderStatus.PENDING,
        user,
        transaction,
        invoice,
      });
      await queryRunner.manager.save(BusTicketOrder, order);

      /**
       * Create Bus ticket and assign the order
       */
      const tickets = busTicketPurchaseDto.passengers.map(
        (
          {
            seatNumber,
            firstName,
            lastName,
            gender,
            tcNumber,
            passport,
            ticketPrice,
          },
          index: number,
        ) =>
          new BusTicket({
            ticketPrice,
            currency: Currency.TRY,
            ticketOrder: index + 1,
            seatNumber,
            passenger: new BusTicketPassenger({
              firstName,
              lastName,
              gender,
              tcNumber,
              passportCountryCode: passport?.countryCode,
              passportNumber: passport?.number,
              passportExpirationDate: passport?.expirationDate,
            }),

            order,
          }),
      );
      await queryRunner.manager.save(BusTicket, tickets);

      const htmlContent = await this.finalizePaymentInit(
        transaction,
        paymentProviderType,
        paymentMethod,
        PaymentFlowType.BUS_TICKET,
        'payment.bus.finish',
        clientIp,
        user,
      );

      await queryRunner.commitTransaction();
      return { transactionId: transaction.id, htmlContent };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
