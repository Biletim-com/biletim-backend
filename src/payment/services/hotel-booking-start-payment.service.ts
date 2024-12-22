import { DataSource } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

// services
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';
import { RatehawkOrderBookingService } from '@app/providers/hotel/ratehawk/services/ratehawk-order-booking.service';

// entities
import { HotelBookingOrder } from '@app/modules/orders/hotel-booking/entities/hotel-booking-order.entity';
import { HotelBookingRoom } from '@app/modules/orders/hotel-booking/entities/hotel-booking-room.entity';
import { HotelRoomGuest } from '@app/modules/orders/hotel-booking/entities/hotel-room-guest.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { Invoice } from '@app/modules/invoices/invoice.entity';
import { User } from '@app/modules/users/user.entity';

// dto
import { HotelBookingPurchaseDto } from '../dto/hotel-booking-purchase.dto';
import { InvoiceDto } from '@app/common/dtos';

// enums
import {
  Currency,
  TransactionStatus,
  TransactionType,
  OrderStatus,
  PaymentProvider,
  InvoiceType,
  TicketType,
  OrderCategory,
  OrderType,
} from '@app/common/enums';

@Injectable()
export class HotelBookingStartPaymentService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly paymentProviderFactory: PaymentProviderFactory,
    private readonly ratehawkOrderBookingService: RatehawkOrderBookingService,
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

  public async startHotelBookingOrderPayment(
    hotelBookingPurchaseDto: HotelBookingPurchaseDto,
    clientIp: string,
    user?: User,
  ) {
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      /**
       * Init Transactions
       */
      const transaction = new Transaction({
        amount: paymentType.showAmount,
        currency: Currency.TRY,
        status: TransactionStatus.PENDING,
        transactionType: TransactionType.PURCHASE,
        paymentProvider: PaymentProvider.VAKIF_BANK,
        // unregistered card
        cardholderName: hotelBookingPurchaseDto.bankCard.holderName,
        maskedPan: hotelBookingPurchaseDto.bankCard.maskedPan,

        bankCard: null,
        wallet: null,
      });
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

      const paymentProvider = this.paymentProviderFactory.getStrategy(
        PaymentProvider.VAKIF_BANK,
      );

      const htmlContent = await paymentProvider.startPayment({
        clientIp,
        ticketType: TicketType.HOTEL,
        paymentMethod: { bankCard: hotelBookingPurchaseDto.bankCard },
        transaction,
      });
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
