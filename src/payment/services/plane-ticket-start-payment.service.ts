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
  PaymentFlowType,
  PaymentProvider,
} from '@app/common/enums';

// dtos
import {
  PlanePassengerInfoDto,
  PlaneTicketPurchaseDto,
} from '../dto/plane-ticket-purchase.dto';

// utils
import { normalizeDecimal, PlaneTicketFeeManager } from '@app/common/utils';

// errors
import { ServiceError } from '@app/common/errors';
import { PriceListDto } from '@app/providers/ticket/biletall/plane/dto/plane-pull-price-flight.dto';

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
      [PassengerType.MILITARY]: 'militaryCount',
    };

    passengers.forEach((passenger) => {
      const countKey = passengerTypeCounts[passenger.passengerType];
      if (countKey) {
        data[countKey] = (data[countKey] || 0) + 1;
      }
    });

    return data;
  }

  private composeFeeByPassengerType(
    priceList: PriceListDto,
  ): Record<
    PassengerType,
    { netPrice: string; tax: string; serviceFee: string; minServiceFee: string }
  > {
    const data = {
      [PassengerType.ADULT]: {
        netPrice: '0',
        tax: '0',
        serviceFee: '0',
        minServiceFee: '0',
      },
      [PassengerType.CHILD]: {
        netPrice: '0',
        tax: '0',
        serviceFee: '0',
        minServiceFee: '0',
      },
      [PassengerType.BABY]: {
        netPrice: '0',
        tax: '0',
        serviceFee: '0',
        minServiceFee: '0',
      },
      [PassengerType.STUDENT]: {
        netPrice: '0',
        tax: '0',
        serviceFee: '0',
        minServiceFee: '0',
      },
      [PassengerType.ELDERLY]: {
        netPrice: '0',
        tax: '0',
        serviceFee: '0',
        minServiceFee: '0',
      },
      [PassengerType.MILITARY]: {
        netPrice: '0',
        tax: '0',
        serviceFee: '0',
        minServiceFee: '0',
      },
    };

    Object.values(PassengerType).forEach((type) => {
      data[type] = {
        netPrice: priceList[`${type}NetPrice`] || '0',
        tax: priceList[`${type}Tax`] || '0',
        serviceFee: priceList[`${type}ServiceFee`] || '0',
        minServiceFee: priceList[`${type}MinServiceFee`] || '0',
      };
    });

    return data;
  }

  private validateTicketsPrice(
    passengers: PlanePassengerInfoDto[],
    originalTotalPrice: string,
    originalTotalMinFee: string,
  ): number {
    const totalAmountToPay = passengers.reduce((acc, passenger) => {
      return (
        acc +
        Number(passenger.netPrice) +
        Number(passenger.taxAmount) +
        Number(passenger.serviceFee)
      );
    }, 0);
    const biletimServiceFee =
      PlaneTicketFeeManager.getAddedFee(totalAmountToPay);
    const obtainedOriginalTotalPrice =
      totalAmountToPay - biletimServiceFee - Number(originalTotalMinFee);
    if (
      normalizeDecimal(obtainedOriginalTotalPrice) !==
      normalizeDecimal(originalTotalPrice)
    ) {
      throw new ServiceError('There is an update in the price');
    }
    return totalAmountToPay;
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

    const passengerTypeCount = this.composePlanePassengerTypeCount(
      planeTicketPurchaseDto.passengers,
    );
    const { priceList } =
      await this.biletAllPlaneSearchService.getPriceOfFlight({
        companyNumber: planeTicketPurchaseDto.companyNumber,
        segments: planeTicketPurchaseDto.segments,
        ...passengerTypeCount,
      });

    const totalAmountToPay = this.validateTicketsPrice(
      planeTicketPurchaseDto.passengers,
      priceList.totalTicketPrice,
      priceList.totalMinServiceFee,
    );

    const feePerPassenger = this.composeFeeByPassengerType(priceList);

    const paymentProviderType = planeTicketPurchaseDto.paymentMethod.useWallet
      ? PaymentProvider.BILETIM_GO
      : PaymentProvider.VAKIF_BANK;

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
        totalAmountToPay.toString(),
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
          const ticketTotalAbount =
            Number(passengerDto.netPrice) +
            Number(passengerDto.taxAmount) +
            Number(passengerDto.serviceFee);
          const biletimFee =
            PlaneTicketFeeManager.getAddedFee(ticketTotalAbount);
          const providerServiceFee =
            Number(passengerDto.serviceFee) -
            Number(feePerPassenger[passengerDto.passengerType].minServiceFee) -
            biletimFee;

          return new PlaneTicket({
            ticketOrder: index + 1,
            ticketNumber: null,
            netPrice: passengerDto.netPrice,
            taxAmount: passengerDto.taxAmount,
            serviceFee: providerServiceFee.toString(),
            biletimFee: (
              biletimFee +
              Number(feePerPassenger[passengerDto.passengerType].minServiceFee)
            ).toString(),
            passenger,
            order,
          });
        },
      );
      // SAVE is intentional here to assign created segments
      await queryRunner.manager.save(PlaneTicket, planeTickets);

      const htmlContent = await this.finalizePaymentInit(
        transaction,
        paymentProviderType,
        paymentMethod,
        PaymentFlowType.PLANE_TICKET,
        'payment.plane.finish',
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
