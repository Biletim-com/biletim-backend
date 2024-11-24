import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';

import { PaymentProviderFactory } from '../factories/payment-provider.factory';
import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';

// entities
import { Order } from '@app/modules/orders/order.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { BusTicket } from '@app/modules/tickets/bus/entities/bus-ticket.entity';
import { BusTerminal } from '@app/modules/tickets/bus/entities/bus-terminal.entity';
import { BusTicketPassenger } from '@app/modules/tickets/bus/entities/bus-ticket-passenger.entity';
import { Invoice } from '@app/modules/invoices/invoice.entity';

// enums
import {
  Currency,
  InvoiceType,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentProvider,
  TicketType,
  TransactionStatus,
  TransactionType,
} from '@app/common/enums';

// dtos
import { InvoiceDto } from '@app/common/dtos';
import { BusTicketPurchaseDto } from '../dto/bus-ticket-purchase.dto';
import { BusSeatAvailabilityRequestDto } from '@app/modules/tickets/bus/dto/bus-seat-availability.dto';

// types
import { UUID } from '@app/common/types';

// errors
import { ServiceError } from '@app/common/errors';
import { normalizeDecimal } from '@app/common/utils';

@Injectable()
export class BusTicketPaymentService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly paymentProviderFactory: PaymentProviderFactory,
    private readonly biletAllBusService: BiletAllBusService,
  ) {}

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
    clientIp: string,
    busTicketPurchaseDto: BusTicketPurchaseDto,
  ): Promise<{ transactionId: UUID; htmlContent: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const trip = busTicketPurchaseDto.trip;

    const [departureTerminal, arrivalTerminal] =
      await queryRunner.manager.findBy(BusTerminal, {
        externalId: In([trip.departureTerminalId, trip.arrivalTerminalId]),
      });

    if (!departureTerminal || !arrivalTerminal) {
      throw new ServiceError('Bus Terminal(s) do not exist');
    }

    /**
     * Validate Company via company number
     */
    const [company] = await this.biletAllBusService.company({
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
      await this.biletAllBusService.busSeatAvailability(
        clientIp,
        busSeatAvailabilityDto,
      );

    if (!busSeatAvailability.isAvailable) {
      throw new ServiceError('Seat(s) are not available anymore');
    }

    const { canSellToForeigners, transactionRules } =
      await this.biletAllBusService.getForeignSaleEligibilityAndTransactionRules(
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

    const paymentProviderType = transactionRules.includes(
      'INTERNAL_VIRTUAL_POS',
    )
      ? PaymentProvider.VAKIF_BANK
      : PaymentProvider.BILET_ALL;

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
        currency: Currency.TL,
        status: TransactionStatus.PENDING,
        transactionType: TransactionType.PURCHASE,
        paymentMethod: PaymentMethod.BANK_CARD,
        paymentProvider: paymentProviderType,
        // unregistered card
        cardholderName: busTicketPurchaseDto.bankCard.holderName,
        maskedPan: busTicketPurchaseDto.bankCard.maskedPan,

        bankCard: null,
        wallet: null,
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
      const order = new Order({
        userEmail: busTicketPurchaseDto.email,
        userPhoneNumber: busTicketPurchaseDto.phoneNumber,
        type: OrderType.PURCHASE,
        status: OrderStatus.PENDING,
        user: null,
        transaction,
        invoice,
      });
      await queryRunner.manager.save(Order, order);

      /**
       * Create Bus ticket and assign the order
       */
      const busTickets = busTicketPurchaseDto.passengers.map(
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
            currency: Currency.TL,
            companyNumber: trip.companyNumber,
            companyName: company.companyName,
            ticketOrder: index + 1,
            routeNumber: trip.routeNumber,
            tripTrackingNumber: busSeatAvailabilityDto.tripTrackingNumber,
            travelStartDateTime: trip.travelStartDateTime,
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
            departureTerminal,
            arrivalTerminal,
            order,
          }),
      );
      await queryRunner.manager.save(BusTicket, busTickets);

      // get strategy dynamically
      const paymentProvider =
        this.paymentProviderFactory.getStrategy(paymentProviderType);

      const htmlContent = await paymentProvider.startPayment(
        clientIp,
        TicketType.BUS,
        busTicketPurchaseDto.bankCard,
        { ...transaction, order: { ...order, busTickets } },
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
