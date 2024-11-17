import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { PaymentProviderFactory } from '../factories/payment-provider.factory';

// entities
import { Order } from '@app/modules/orders/order.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { BiletAllPlaneService } from '@app/modules/tickets/plane/services/biletall/biletall-plane.service';
import { PlaneTicketPassenger } from '@app/modules/tickets/plane/entities/plane-ticket-passenger.entity';
import { PlaneTicket } from '@app/modules/tickets/plane/entities/plane-ticket.entity';
import { PlaneTicketSegment } from '@app/modules/tickets/plane/entities/plane-ticket-segment.entity';

// enums
import {
  Currency,
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

// utils
import { normalizeDecimal } from '@app/common/utils';

// errors
import { ServiceError } from '@app/common/errors';

@Injectable()
export class PlaneTicketPaymentService {
  private readonly logger = new Logger(PlaneTicketPaymentService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly paymentProviderFactory: PaymentProviderFactory,
    private readonly biletAllPlaneService: BiletAllPlaneService,
  ) {}

  private composePlanePassengerType(
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
    clientIp: string,
    planeTicketPurchaseDto: PlaneTicketPurchaseDto,
  ): Promise<{ transactionId: string; htmlContent: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const passengerTypeCounts = this.composePlanePassengerType(
      planeTicketPurchaseDto.passengers,
    );
    const { priceList } = await this.biletAllPlaneService.pullPriceOfFlight({
      companyNo: planeTicketPurchaseDto.companyNo,
      segments: planeTicketPurchaseDto.segments,
      ...passengerTypeCounts,
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
        currency: Currency.TL,
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
       * Create Order
       */
      const order = new Order({
        firstName: '',
        lastName: '',
        userEmail: planeTicketPurchaseDto.email,
        userPhoneNumber: planeTicketPurchaseDto.phoneNumber,
        type: OrderType.PURCHASE,
        status: OrderStatus.PENDING,
        transaction,
        user: null,
      });
      await queryRunner.manager.insert(Order, order);

      /**
       * Create Segments
       */
      const segments = planeTicketPurchaseDto.segments.map(
        (segment, index) =>
          new PlaneTicketSegment({
            ...segment,
            companyNo: planeTicketPurchaseDto.companyNo,
            segmentOrder: index + 1,
          }),
      );
      await queryRunner.manager.insert(PlaneTicketSegment, segments);

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
            passportCountryCode: passengerDto.passport?.passportCountryCode,
            passportNumber: passengerDto.passport?.passportNumber,
            passportExpirationDate:
              passengerDto.passport?.passportExpirationDate,
          });

          return new PlaneTicket({
            ticketOrder: index + 1,
            ticketNumber: null,
            netPrice: passengerDto.netPrice,
            taxAmount: passengerDto.taxAmount,
            serviceFee: passengerDto.serviceFee,
            biletimFee: passengerDto.serviceFee, // TODO: temporary
            passenger,
            segments,
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
