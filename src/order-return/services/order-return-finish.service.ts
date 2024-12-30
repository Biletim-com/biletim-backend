import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

// entities
import { Wallet } from '@app/modules/wallets/wallet.entity';

// services
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';
import { OrderEntityFactoryService } from '../factories/order-entity.factory.service';
import { OrderReturnValidationService } from './order-return-validation.service';
import { VerificationService } from '@app/modules/verification/verification.service';
import { BiletAllBusTicketReturnService } from '@app/providers/ticket/biletall/bus/services/biletall-bus-ticket-return.service';
import { BiletAllPlaneTicketReturnService } from '@app/providers/ticket/biletall/plane/services/biletall-plane-ticket-return.service';
import { RatehawkOrderCancelService } from '@app/providers/hotel/ratehawk/services/ratehawk-order-cancel.service';

// repositories
import { UsersRepository } from '@app/modules/users/users.repository';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { User } from '@app/modules/users/user.entity';

// dto
import { OrderReturnValidationDto } from '../dto/order-return-validation.dto';

// enums
import {
  OrderStatus,
  OrderType,
  PaymentProvider,
  PaymentRefundSource,
  TransactionStatus,
} from '@app/common/enums';

// errors
import { ServiceError, WalletNotFoundError } from '@app/common/errors';

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
    private readonly usersRepository: UsersRepository,
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

  private async validateReturnSource(
    returnToWallet: boolean,
    user?: User,
  ): Promise<Wallet | null> {
    if (returnToWallet === false) {
      return null;
    }
    if (!user) {
      throw new ServiceError(
        'payment couldnt be initialized without the user identified',
      );
    }

    const userWithWallet = await this.usersRepository.findOne({
      where: { id: user?.id },
      relations: { wallet: true },
    });
    const userWallet = userWithWallet?.wallet;
    if (!userWallet) {
      throw new WalletNotFoundError();
    }
    return userWallet;
  }

  public async finishReturn(
    clientIp: string,
    reservationNumber: string,
    passengerLastName: string,
    orderType: OrderType,
    verificationCode: number,
    returnToWallet: boolean,
    user?: User,
  ): Promise<void> {
    const returnSource = await this.validateReturnSource(returnToWallet, user);

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
      const returnProvider =
        returnSource instanceof Wallet
          ? PaymentProvider.BILETIM_GO
          : order.transaction.paymentProvider;
      const refundAmount = order.penalty.amountToRefund;

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
        await this.ratehawkOrderCancelService.orderCancellation(
          reservationNumber,
        );
      }

      // return money
      if (returnProvider !== PaymentProvider.BILET_ALL) {
        const paymentProvider =
          this.paymentProviderFactory.getStrategy(returnProvider);

        await paymentProvider.refundPayment({
          clientIp,
          transactionId: order.transaction.id,
          refundAmount,
          details: {
            walletId: returnSource?.id,
          },
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
          refundSource:
            returnProvider === PaymentProvider.BILETIM_GO
              ? PaymentRefundSource.WALLET
              : PaymentRefundSource.BANK_CARD,
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
