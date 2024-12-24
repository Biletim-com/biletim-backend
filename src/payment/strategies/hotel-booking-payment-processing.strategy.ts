import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

// services
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';
import { RatehawkOrderBookingService } from '@app/providers/hotel/ratehawk/services/ratehawk-order-booking.service';

// repositories
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';
import { HotelBookingOrdersRepository } from '@app/modules/orders/hotel-booking/hotel-booking-orders.repository';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { HotelBookingOrder } from '@app/modules/orders/hotel-booking/entities/hotel-booking-order.entity';

// factories
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';

// abstract
import { IPaymentProcessingStrategy } from '../interfaces/payment-processing.strategy.interface';

// dto
import { VakifBankPaymentResultDto } from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';
import { BiletimGoPaymentResultDto } from '@app/providers/payment/biletim-go/dto/biletim-go-payment-result.dto';

// enums
import { OrderStatus, TransactionStatus } from '@app/common/enums';

// types
import { UUID } from '@app/common/types';
import { PaymentProcessingActions } from '../types/payment-processing-actions.type';

// errors
import { TransactionNotFoundError } from '@app/common/errors';

// decorators
import { OnEvent } from '@app/providers/event-emitter/decorators';

@Injectable()
export class HotelBookingPaymentProcessingStrategy
  implements IPaymentProcessingStrategy
{
  private readonly logger = new Logger(
    HotelBookingPaymentProcessingStrategy.name,
  );

  constructor(
    private readonly dataSource: DataSource,
    private readonly eventEmitterService: EventEmitterService,
    private readonly paymentProviderFactory: PaymentProviderFactory,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly hotelBookingOrdersRepository: HotelBookingOrdersRepository,
    private readonly ratehawkOrderBookingService: RatehawkOrderBookingService,
  ) {}

  @OnEvent('payment.hotel.finish')
  async handlePayment(
    clientIp: string,
    transactionId: UUID,
    paymentResultDto: VakifBankPaymentResultDto | BiletimGoPaymentResultDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: {
        id: transactionId,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const actionsCompleted: PaymentProcessingActions = [];
    const paymentProvider = this.paymentProviderFactory.getStrategy(
      transaction.paymentProvider,
    );

    try {
      /**
       * finalize payment
       */
      await paymentProvider.finishPayment({
        clientIp,
        details: {
          ...paymentResultDto,
          PurchAmount: transaction.amount,
        },
        orderId: transaction.hotelBookingOrder.id,
      });
      actionsCompleted.push('PAYMENT');

      /**
       * send purchase request to ratehawk
       */
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

      await this.handlePaymentFailure(transaction, errorMessage);

      if (actionsCompleted.includes('PAYMENT')) {
        paymentProvider.cancelPayment({
          clientIp,
          transactionId: transaction.id,
        });
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

  async handlePaymentFailure(
    transactionOrTransactionId: Transaction | UUID,
    errorMessage?: string,
  ): Promise<void> {
    this.logger.error(`Hotel booking payment failed: ${errorMessage}`);

    const transaction = await this.transactionsRepository.findEntityData(
      transactionOrTransactionId,
      { hotelBookingOrder: true },
    );

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
  }
}
