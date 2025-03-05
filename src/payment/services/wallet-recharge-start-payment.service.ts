import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

// services
import { AbstractStartPaymentService } from '../abstract/start-payment.abstract.service';
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';

// factories
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';

// repositories
import { UsersRepository } from '@app/modules/users/users.repository';
import { WalletsRepository } from '@app/modules/wallets/wallets.repository';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { WalletRechargeOrder } from '@app/modules/orders/wallet-recharge-order/wallet-recharge-order.entity';
import { User } from '@app/modules/users/user.entity';

// dto
import { WalletRechargePurchaseDto } from '../dto/wallet-recharge-purchase.dto';

// enums
import {
  PaymentProvider,
  PaymentFlowType,
  OrderType,
  OrderCategory,
  OrderStatus,
} from '@app/common/enums';

// errors
import { WalletNotFoundError } from '@app/common/errors';

@Injectable()
export class WalletRechargeStartPaymentService extends AbstractStartPaymentService {
  constructor(
    usersRepository: UsersRepository,
    eventEmitter: EventEmitterService,
    paymentProviderFactory: PaymentProviderFactory,
    private readonly dataSource: DataSource,
    private readonly walletsRepository: WalletsRepository,
  ) {
    super(usersRepository, eventEmitter, paymentProviderFactory);
  }

  public async startWalletRechargePayment(
    walletRechargePurchaseDto: WalletRechargePurchaseDto,
    clientIp: string,
    user: User,
  ) {
    const userWallet = await this.walletsRepository.findOneBy({
      user: {
        id: user.id,
      },
    });
    if (!userWallet) {
      throw new WalletNotFoundError();
    }

    const paymentMethod = await this.validatePaymentMethod(
      walletRechargePurchaseDto.paymentMethod,
      user,
    );

    const paymentProviderType = PaymentProvider.VAKIF_BANK;

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
        walletRechargePurchaseDto.rechargeAmount,
        paymentProviderType,
        paymentMethod,
      );
      await queryRunner.manager.insert(Transaction, transaction);

      /**
       * Create Order
       */
      const order = new WalletRechargeOrder({
        userEmail: user.email,
        userPhoneNumber: '',
        type: OrderType.WALLET_RECHARGE,
        category: OrderCategory.PURCHASE,
        status: OrderStatus.PENDING,
        transaction,
        user,
        wallet: userWallet,
      });
      await queryRunner.manager.insert(WalletRechargeOrder, order);

      const htmlContent = await this.finalizePaymentInit(
        transaction,
        paymentProviderType,
        paymentMethod,
        PaymentFlowType.WALLET_RECHARGE,
        'payment.wallet-recharge.finish',
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
