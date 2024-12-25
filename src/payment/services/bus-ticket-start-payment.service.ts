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
import { Invoice } from '@app/modules/invoices/invoice.entity';
import { User } from '@app/modules/users/user.entity';

// enums
import {
  Currency,
  InvoiceType,
  OrderCategory,
  OrderStatus,
  OrderType,
  PaymentProvider,
  TicketType,
  TransactionStatus,
  TransactionType,
} from '@app/common/enums';

// dtos
import { InvoiceDto } from '../dto/invoice.dto';
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
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitterService,
    private readonly paymentProviderFactory: PaymentProviderFactory,
    private readonly biletAllBusSearchService: BiletAllBusSearchService,
    usersRepository: UsersRepository,
  ) {
    super(usersRepository);
  }

  private composeOrderInvoice(invoiceDto: InvoiceDto): Invoice {
    const invoiceType: InvoiceType = invoiceDto.individual
      ? InvoiceType.INDIVIDUAL
      : InvoiceType.CORPORATE;
    const invoice = {
      ...(invoiceDto.individual || {}),
      ...(invoiceDto.company || {}),
    };

    return new Invoice({
      type: invoiceType,
      pnr: null,
      recipientName: `${invoice.firstName} ${invoice.lastName}` || invoice.name,
      identifier: invoice.tcNumber || invoice.taxNumber,
      address: invoice.address,
      taxOffice: invoice.taxOffice,
      phoneNumber: invoice.phoneNumber,
      email: invoice.email,
    });
  }

  async busTicketPurchase(
    busTicketPurchaseDto: BusTicketPurchaseDto,
    clientIp: string,
    user?: User,
  ): Promise<{ transactionId: UUID; htmlContent: string }> {
    const paymentMethod = await this.validatePaymentMethod(
      busTicketPurchaseDto.paymentMethod,
      user,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const trip = busTicketPurchaseDto.trip;

    const terminals = await queryRunner.manager.findBy(BusTerminal, {
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

    try {
      /**
       * Init Transactions
       */
      const transaction = new Transaction({
        amount: totalTicketPrice,
        currency: Currency.TRY,
        status: TransactionStatus.PENDING,
        transactionType: TransactionType.PURCHASE,
        paymentProvider: paymentProviderType,
        // unregistered card
        ...(paymentMethod.bankCard
          ? {
              cardholderName: paymentMethod.bankCard.holderName,
              maskedPan: paymentMethod.bankCard.maskedPan,
            }
          : {}),

        // saved bank card
        ...(paymentMethod.savedBankCard
          ? {
              bankCard: paymentMethod.savedBankCard,
            }
          : {}),

        // wallet
        ...(paymentMethod.wallet ? { wallet: paymentMethod.wallet } : {}),
      });
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

      // get strategy dynamically
      const paymentProvider =
        this.paymentProviderFactory.getStrategy(paymentProviderType);

      const htmlContent = await paymentProvider.startPayment({
        clientIp,
        ticketType: TicketType.BUS,
        paymentMethod,
        transaction: { ...transaction, busTicketOrder: { ...order, tickets } },
      });
      await queryRunner.commitTransaction();

      /**
       * Finish payments direnctly make with the wallet
       */
      if (paymentMethod.wallet) {
        this.eventEmitter.emitEvent(
          'payment.bus.finish',
          clientIp,
          transaction.id,
          {
            amount: transaction.amount,
            walletId: paymentMethod.wallet.id,
          },
        );
      }
      return { transactionId: transaction.id, htmlContent };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
