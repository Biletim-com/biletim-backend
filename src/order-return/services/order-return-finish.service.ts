import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

// services
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';
import { OrderEntityFactoryService } from '../factories/order-entity.factory.service';
import { OrderReturnValidationService } from './order-return-validation.service';
import { VerificationService } from '@app/modules/verification/verification.service';
import { BiletAllBusTicketReturnService } from '@app/providers/ticket/biletall/bus/services/biletall-bus-ticket-return.service';
import { BiletAllPlaneTicketReturnService } from '@app/providers/ticket/biletall/plane/services/biletall-plane-ticket-return.service';
import { RatehawkOrderCancelService } from '@app/providers/hotel/ratehawk/services/ratehawk-order-cancel.service';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';

// dto
import { OrderReturnValidationDto } from '../dto/order-return-validation.dto';

// enums
import {
  OrderStatus,
  OrderType,
  PaymentProvider,
  TransactionStatus,
} from '@app/common/enums';

@Injectable()
export class OrderReturnFinishService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly orderEntityFactoryService: OrderEntityFactoryService,
    private readonly orderReturnValidationService: OrderReturnValidationService,
    private readonly verificaitonService: VerificationService,
    private readonly biletAllBusTicketReturnService: BiletAllBusTicketReturnService,
    private readonly biletAllPlaneTicketReturnService: BiletAllPlaneTicketReturnService,
    private readonly ratehawkOrderCancelService: RatehawkOrderCancelService,
    private readonly paymentProviderFactory: PaymentProviderFactory,
  ) {}

  private async validateVerificationCode(
    reservationNumber: string,
    passengerLastName: string,
    orderType: OrderType,
    verificationCode: number,
  ): Promise<OrderReturnValidationDto> {
    const order = await this.orderReturnValidationService.validateOrder(
      reservationNumber,
      passengerLastName,
      orderType,
    );

    const verification =
      await this.verificaitonService.findByOrderIdAndVerificationCode(
        order.id,
        verificationCode,
      );
    await this.verificaitonService.verifyVerification(verification);
    await this.verificaitonService.markAsUsed(verification.id);

    return order;
  }

  public async finishReturn(
    clientIp: string,
    reservationNumber: string,
    passengerLastName: string,
    orderType: OrderType,
    verificationCode: number,
  ): Promise<void> {
    const order = await this.validateVerificationCode(
      reservationNumber,
      passengerLastName,
      orderType,
      verificationCode,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const paymentProviderName = order.transaction.paymentProvider;
      let refundAmount = order.penalty.amountToRefund;

      // return ticket
      if (order.type === OrderType.BUS_TICKET) {
        await this.biletAllBusTicketReturnService.returnBusTicket(
          reservationNumber,
        );
      } else if (order.type === OrderType.PLANE_TICKET) {
        await this.biletAllPlaneTicketReturnService.returnPlaneTicket(
          reservationNumber,
          passengerLastName,
          refundAmount,
        );
      } else {
        const hotelRefund =
          await this.ratehawkOrderCancelService.orderCancellation(
            reservationNumber,
          );
        refundAmount = hotelRefund.amountRefunded?.amount || refundAmount;
      }

      // return money
      if (paymentProviderName !== PaymentProvider.BILET_ALL) {
        const paymentProvider =
          this.paymentProviderFactory.getStrategy(paymentProviderName);

        await paymentProvider.refundPayment({
          clientIp,
          transactionId: order.transaction.id,
          refundAmount,
        });
      }

      await Promise.all([
        await queryRunner.manager.update(
          this.orderEntityFactoryService.getEntity(order.type),
          order.id,
          {
            status: OrderStatus.REFUND_PROCESSED,
          },
        ),
        await queryRunner.manager.update(Transaction, order.transaction.id, {
          status: TransactionStatus.REFUND_PROCESSED,
          refundAmount,
        }),
      ]);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
