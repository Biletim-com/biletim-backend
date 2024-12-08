import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

// services
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';
import { OrderReturnValidationService } from './order-return-validation.service';
import { VerificationService } from '@app/modules/verification/verification.service';
import { BiletAllBusTicketReturnService } from '@app/providers/ticket/biletall/bus/services/biletall-bus-ticket-return.service';
import { BiletAllPlaneTicketReturnService } from '@app/providers/ticket/biletall/plane/services/biletall-plane-ticket-return.service';

// entities
import { Order } from '@app/modules/orders/order.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';

// dto
import { OrderReturnValidationDto } from '../dto/order-return-validation.dto';

// enums
import {
  OrderStatus,
  PaymentMethod,
  PaymentProvider,
  TransactionStatus,
} from '@app/common/enums';

@Injectable()
export class OrderReturnFinishService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly orderReturnValidationService: OrderReturnValidationService,
    private readonly verificaitonService: VerificationService,
    private readonly biletAllBusTicketReturnService: BiletAllBusTicketReturnService,
    private readonly biletAllPlaneTicketReturnService: BiletAllPlaneTicketReturnService,
    private readonly paymentProviderFactory: PaymentProviderFactory,
  ) {}

  private async validateVerificationCode(
    pnrNumber: string,
    passengerLastName: string,
    verificationCode: number,
  ): Promise<OrderReturnValidationDto> {
    const order =
      await this.orderReturnValidationService.validateOrderWithPnrNumber(
        pnrNumber,
        passengerLastName,
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
    pnrNumber: string,
    passengerLastName: string,
    verificationCode: number,
  ): Promise<void> {
    const order = await this.validateVerificationCode(
      pnrNumber,
      passengerLastName,
      verificationCode,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const paymentMethod = order.transaction.paymentMethod;
      const paymentProviderName = order.transaction.paymentProvider;
      const refundAmount = order.penalty.amountToRefund;

      // return ticket
      if (order.busTickets.length > 0) {
        await this.biletAllBusTicketReturnService.returnBusTicket(pnrNumber);
      } else {
        await this.biletAllPlaneTicketReturnService.returnPlaneTicket(
          pnrNumber,
          passengerLastName,
          refundAmount,
        );
      }

      // return money
      if (
        paymentMethod === PaymentMethod.BANK_CARD &&
        paymentProviderName &&
        paymentProviderName !== PaymentProvider.BILET_ALL
      ) {
        const paymentProvider =
          this.paymentProviderFactory.getStrategy(paymentProviderName);

        await paymentProvider.refundPayment(
          clientIp,
          order.transaction.id,
          refundAmount,
        );
      } else {
        // TODO: it is purchased with wallet then
      }

      await Promise.all([
        await queryRunner.manager.update(Order, order.id, {
          status: OrderStatus.REFUND_PROCESSED,
        }),
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
