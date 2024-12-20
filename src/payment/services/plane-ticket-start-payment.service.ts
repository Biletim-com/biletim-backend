import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

// services
import { BiletAllPlaneSearchService } from '@app/providers/ticket/biletall/plane/services/biletall-plane-search.service';
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';

// entities
import { PlaneTicketOrder } from '@app/modules/orders/plane-ticket/entities/plane-ticket-order.entity';
import { PlaneTicketSegment } from '@app/modules/orders/plane-ticket/entities/plane-ticket-segment.entity';
import { PlaneTicketPassenger } from '@app/modules/orders/plane-ticket/entities/plane-ticket-passenger.entity';
import { PlaneTicket } from '@app/modules/orders/plane-ticket/entities/plane-ticket.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { Airport } from '@app/providers/ticket/biletall/plane/entities/airport.entity';
import { Invoice } from '@app/modules/invoices/invoice.entity';
import { User } from '@app/modules/users/user.entity';

// enums
import {
  Currency,
  InvoiceType,
  OrderCategory,
  OrderStatus,
  OrderType,
  PassengerType,
  PaymentMethod,
  PaymentProvider,
  TicketType,
  TransactionStatus,
  TransactionType,
} from '@app/common/enums';

// dtos
import {
  PlanePassengerInfoDto,
  PlaneTicketPurchaseDto,
} from '../dto/plane-ticket-purchase.dto';
import { InvoiceDto } from '@app/common/dtos';

// utils
import { normalizeDecimal } from '@app/common/utils';

// errors
import { ServiceError } from '@app/common/errors';

@Injectable()
export class PlaneTicketStartPaymentService {
  private readonly logger = new Logger(PlaneTicketStartPaymentService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly paymentProviderFactory: PaymentProviderFactory,
    private readonly biletAllPlaneSearchService: BiletAllPlaneSearchService,
  ) {}

  private composePlanePassengerTypeCount(
    passengers: {
      passengerType: PassengerType;
    }[],
  ): {
    adultCount: number;
    childCount: number;
    babyCount: number;
    elderlyCount: number;
  } {
    const data = {
      adultCount: 0,
      childCount: 0,
      babyCount: 0,
      elderlyCount: 0,
    };

    const passengerTypeCounts = {
      [PassengerType.ADULT]: 'adultCount',
      [PassengerType.CHILD]: 'childCount',
      [PassengerType.BABY]: 'babyCount',
      [PassengerType.STUDENT]: 'studentCount',
      [PassengerType.ELDERLY]: 'elderlyCount',
    };

    passengers.forEach((passenger) => {
      const countKey = passengerTypeCounts[passenger.passengerType];
      if (countKey) {
        data[countKey] = (data[countKey] || 0) + 1;
      }
    });

    return data;
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

  private validateTicketsPrice(
    passengers: PlanePassengerInfoDto[],
    totalPrice: string,
  ) {
    const totalPriseOutOfDto = passengers.reduce((acc, passenger) => {
      return (
        acc +
        Number(passenger.netPrice) +
        Number(passenger.taxAmount) +
        Number(passenger.serviceFee)
      );
    }, 0);
    if (normalizeDecimal(totalPriseOutOfDto) !== normalizeDecimal(totalPrice)) {
      throw new ServiceError('There is an update in the price');
    }
  }

  async startPlaneTicketPurchase(
    planeTicketPurchaseDto: PlaneTicketPurchaseDto,
    clientIp: string,
    user?: User,
  ): Promise<{ transactionId: string; htmlContent: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const passengerTypeCount = this.composePlanePassengerTypeCount(
      planeTicketPurchaseDto.passengers,
    );
    const { priceList } =
      await this.biletAllPlaneSearchService.getPriceOfFlight({
        companyNumber: planeTicketPurchaseDto.companyNumber,
        segments: planeTicketPurchaseDto.segments,
        ...passengerTypeCount,
      });

    this.validateTicketsPrice(
      planeTicketPurchaseDto.passengers,
      priceList.totalTicketPrice,
    );

    try {
      /**
       * Init Transactions
       */
      const transaction = new Transaction({
        amount: priceList.totalTicketPrice,
        currency: Currency.TRY,
        status: TransactionStatus.PENDING,
        transactionType: TransactionType.PURCHASE,
        paymentMethod: PaymentMethod.BANK_CARD,
        paymentProvider: PaymentProvider.VAKIF_BANK,
        // unregistered card
        cardholderName: planeTicketPurchaseDto.bankCard.holderName,
        maskedPan: planeTicketPurchaseDto.bankCard.maskedPan,

        bankCard: null,
        wallet: null,
      });
      await queryRunner.manager.insert(Transaction, transaction);

      /**
       * Compose Invoice fields
       */
      const invoice = this.composeOrderInvoice(planeTicketPurchaseDto.invoice);

      /**
       * Create Order
       */
      const order = new PlaneTicketOrder({
        userEmail: planeTicketPurchaseDto.email,
        userPhoneNumber: planeTicketPurchaseDto.phoneNumber,
        type: OrderType.PLANE_TICKET,
        category: OrderCategory.PURCHASE,
        status: OrderStatus.PENDING,
        invoice,
        transaction,
        user,
      });
      await queryRunner.manager.save(PlaneTicketOrder, order);

      /**
       * Create Segments
       */
      const segments = planeTicketPurchaseDto.segments.map(
        (segment, index) =>
          new PlaneTicketSegment({
            ...segment,
            order,
            departureAirport: new Airport({
              airportCode: segment.departureAirport,
            }),
            arrivalAirport: new Airport({
              airportCode: segment.arrivalAirport,
            }),
            companyNumber: planeTicketPurchaseDto.companyNumber,
            segmentOrder: index + 1,
          }),
      );
      await queryRunner.manager.save(PlaneTicketSegment, segments);

      /**
       * Create Plane tickets, and assign the order and the segments
       */
      const planeTickets = planeTicketPurchaseDto.passengers.map(
        (passengerDto, index: number) => {
          const passenger = new PlaneTicketPassenger({
            firstName: passengerDto.firstName,
            lastName: passengerDto.lastName,
            gender: passengerDto.gender,
            passengerType: passengerDto.passengerType,
            birthday: passengerDto.birthday,
            tcNumber: passengerDto.tcNumber,
            passportCountryCode: passengerDto.passport?.countryCode,
            passportNumber: passengerDto.passport?.number,
            passportExpirationDate: passengerDto.passport?.expirationDate,
          });

          return new PlaneTicket({
            ticketOrder: index + 1,
            ticketNumber: null,
            netPrice: passengerDto.netPrice,
            taxAmount: passengerDto.taxAmount,
            serviceFee: passengerDto.serviceFee,
            biletimFee: passengerDto.serviceFee, // TODO: temporary
            passenger,
            order,
          });
        },
      );
      // SAVE is intentianal here to assign created segments
      await queryRunner.manager.save(PlaneTicket, planeTickets);

      const paymentProvider = this.paymentProviderFactory.getStrategy(
        PaymentProvider.VAKIF_BANK,
      );

      const htmlContent = await paymentProvider.startPayment(
        clientIp,
        TicketType.PLANE,
        planeTicketPurchaseDto.bankCard,
        transaction,
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
