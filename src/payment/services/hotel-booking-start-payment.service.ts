import { DataSource } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

// services
import { RatehawkOrderBookingService } from '@app/providers/hotel/ratehawk/services/ratehawk-order-booking.service';
import { AbstractStartPaymentService } from '../abstract/start-payment.abstract.service';
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';

// factories
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';

// repositories
import { UsersRepository } from '@app/modules/users/users.repository';

// entities
import { HotelBookingOrder } from '@app/modules/orders/hotel-booking/entities/hotel-booking-order.entity';
import { HotelBookingRoom } from '@app/modules/orders/hotel-booking/entities/hotel-booking-room.entity';
import { HotelRoomGuest } from '@app/modules/orders/hotel-booking/entities/hotel-room-guest.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { User } from '@app/modules/users/user.entity';

// dto
import { HotelBookingPurchaseDto } from '../dto/hotel-booking-purchase.dto';

// enums
import {
  OrderStatus,
  PaymentProvider,
  OrderCategory,
  OrderType,
  PaymentFlowType,
} from '@app/common/enums';

@Injectable()
export class HotelBookingStartPaymentService extends AbstractStartPaymentService {
  constructor(
    usersRepository: UsersRepository,
    eventEmitter: EventEmitterService,
    paymentProviderFactory: PaymentProviderFactory,
    private readonly dataSource: DataSource,
    private readonly ratehawkOrderBookingService: RatehawkOrderBookingService,
  ) {
    super(usersRepository, eventEmitter, paymentProviderFactory);
  }

  public async startHotelBookingOrderPayment(
    hotelBookingPurchaseDto: HotelBookingPurchaseDto,
    clientIp: string,
    user?: User,
  ) {
    const paymentMethod = await this.validatePaymentMethod(
      hotelBookingPurchaseDto.paymentMethod,
      user,
    );

    const {
      rates: [rate],
      changes,
    } = await this.ratehawkOrderBookingService.validateRate({
      bookHash: hotelBookingPurchaseDto.bookHash,
      priceIncreasePercent: 0,
    });

    if (changes.priceChanged) {
      throw new BadRequestException('Rate price has been changed');
    }
    const paymentType = rate.paymentOptions.paymentTypes.find(
      (paymentType) => paymentType.type === 'deposit',
    );
    if (!paymentType) {
      throw new BadRequestException('Payment method is not compatible');
    }
    const roomName = rate.roomName;
    const cancellationPenalties =
      rate.paymentOptions.paymentTypes[0].cancellationPenalties;

    const paymentProviderType = hotelBookingPurchaseDto.paymentMethod.useWallet
      ? PaymentProvider.BILETIM_GO
      : PaymentProvider.VAKIF_BANK;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      /**
       * Init Transactions
       */
      const transaction = this.composeTransaction(
        paymentType.showAmount,
        paymentProviderType,
        paymentMethod,
      );
      await queryRunner.manager.insert(Transaction, transaction);

      /**
       * Compose Invoice fields
       */
      const invoice = this.composeOrderInvoice(hotelBookingPurchaseDto.invoice);

      /**
       * Create HotelBookingOrder
       */
      const orderToCreate = new HotelBookingOrder({
        userEmail: hotelBookingPurchaseDto.email,
        userPhoneNumber: hotelBookingPurchaseDto.phoneNumber,
        checkinDateTime: hotelBookingPurchaseDto.checkinDateTime,
        checkoutDateTime: hotelBookingPurchaseDto.checkoutDateTime,
        type: OrderType.HOTEL_BOOKING,
        category: OrderCategory.PURCHASE,
        status: OrderStatus.PENDING,
        user,
        transaction,
        invoice,
        upsell: [],
        cancellationPenalties,
        paymentType: {
          type: paymentType.type,
          amount: paymentType.amount,
          currencyCode: paymentType.currencyCode,
        },
      });
      const order = await queryRunner.manager.save(
        HotelBookingOrder,
        orderToCreate,
      );

      /**
       * Create Rooms and Guests
       */
      const roomsAndGuests = new HotelBookingRoom({
        name: roomName,
        guests: hotelBookingPurchaseDto.guests.map(
          (guest) => new HotelRoomGuest({ ...guest }),
        ),
        order,
      });
      await queryRunner.manager.save(HotelBookingRoom, roomsAndGuests);

      /**
       * Start booking against the provider
       * need to figure out this usellData shit
       */
      const { upsellData } =
        await this.ratehawkOrderBookingService.orderBookingForm(clientIp, {
          bookHash: hotelBookingPurchaseDto.bookHash,
          language: 'en',
          orderId: order.reservationNumber.toString(),
        });

      /**
       * Update HotelBookingOrder with the upsell data
       */
      // await queryRunner.manager.update(HotelBookingOrder, order.id, {
      //   upsell: [],
      // });

      await queryRunner.commitTransaction();
      const htmlContent = await this.finalizePaymentInit(
        transaction,
        paymentProviderType,
        paymentMethod,
        PaymentFlowType.HOTEL_BOOKING,
        'payment.hotel.finish',
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
