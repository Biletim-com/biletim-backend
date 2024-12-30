import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

// services
import { BiletAllPlaneSearchService } from '@app/providers/ticket/biletall/plane/services/biletall-plane-search.service';
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';
import { AbstractStartPaymentService } from '../abstract/start-payment.abstract.service';
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';

// repositories
import { UsersRepository } from '@app/modules/users/users.repository';

// entities
import { PlaneTicketOrder } from '@app/modules/orders/plane-ticket/entities/plane-ticket-order.entity';
import { PlaneTicketSegment } from '@app/modules/orders/plane-ticket/entities/plane-ticket-segment.entity';
import { PlaneTicketPassenger } from '@app/modules/orders/plane-ticket/entities/plane-ticket-passenger.entity';
import { PlaneTicket } from '@app/modules/orders/plane-ticket/entities/plane-ticket.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { Airport } from '@app/providers/ticket/biletall/plane/entities/airport.entity';
import { User } from '@app/modules/users/user.entity';

// enums
import {
  OrderCategory,
  OrderStatus,
  OrderType,
  PassengerType,
  PaymentProvider,
  TicketType,
} from '@app/common/enums';

// dtos
import {
  PlanePassengerInfoDto,
  PlaneTicketPurchaseDto,
} from '../dto/plane-ticket-purchase.dto';

// utils
import { normalizeDecimal } from '@app/common/utils';

// errors
import { ServiceError } from '@app/common/errors';

@Injectable()
export class PlaneTicketStartPaymentService extends AbstractStartPaymentService {
  private readonly logger = new Logger(PlaneTicketStartPaymentService.name);

  constructor(
    usersRepository: UsersRepository,
    eventEmitter: EventEmitterService,
    paymentProviderFactory: PaymentProviderFactory,
    private readonly dataSource: DataSource,
    private readonly biletAllPlaneSearchService: BiletAllPlaneSearchService,
  ) {
    super(usersRepository, eventEmitter, paymentProviderFactory);
  }

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
  ): Promise<{ transactionId: string; htmlContent: string | null }> {
    const paymentMethod = await this.validatePaymentMethod(
      planeTicketPurchaseDto.paymentMethod,
      user,
    );

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

    const paymentProviderType = planeTicketPurchaseDto.paymentMethod.useWallet
      ? PaymentProvider.BILETIM_GO
      : PaymentProvider.VAKIF_BANK;

    try {
      /**
       * Init Transactions
       */
      const transaction = this.composeTransaction(
        priceList.totalTicketPrice,
        paymentProviderType,
        paymentMethod,
      );
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
      // SAVE is intentional here to assign created segments
      await queryRunner.manager.save(PlaneTicket, planeTickets);
      await queryRunner.commitTransaction();

      const htmlContent = await this.finalizePaymentInit(
        transaction,
        paymentProviderType,
        paymentMethod,
        TicketType.PLANE,
        'payment.plane.finish',
        clientIp,
        user,
      );

      return { transactionId: transaction.id, htmlContent };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
