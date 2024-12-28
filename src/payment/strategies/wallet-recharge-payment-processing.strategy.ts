import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

// repositories
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';

// entities
import { Wallet } from '@app/modules/wallets/wallet.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';

// factories
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';

// abstract
import { IPaymentProcessingStrategy } from '../interfaces/payment-processing.strategy.interface';

// dto
import {
  VakifBankPaymentResultDto,
  VakifBankSavedCardPaymentFinishDto,
} from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';

// enums
import { OrderStatus, TransactionStatus } from '@app/common/enums';

// types
import { UUID } from '@app/common/types';
import { PaymentProcessingActions } from '../types/payment-processing-actions.type';

// errors
import { TransactionNotFoundError } from '@app/common/errors';

// decorators
import { OnEvent } from '@app/providers/event-emitter/decorators';
import { WalletRechargeOrder } from '@app/modules/orders/wallet-recharge-order/wallet-recharge-order.entity';

@Injectable()
export class WalletRechargePaymentProcessingStrategy
  implements IPaymentProcessingStrategy
{
  private readonly logger = new Logger(
    WalletRechargePaymentProcessingStrategy.name,
  );

  constructor(
    private readonly dataSource: DataSource,
    private readonly paymentProviderFactory: PaymentProviderFactory,
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  @OnEvent('payment.wallet-recharge.finish')
  async handlePayment(
    clientIp: string,
    transactionId: UUID,
    paymentResultDto:
      | VakifBankPaymentResultDto
      | VakifBankSavedCardPaymentFinishDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: {
        id: transactionId,
      },
      relations: {
        walletRechargeOrder: {
          wallet: true,
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
        orderId: transaction.walletRechargeOrder.id,
      });
      actionsCompleted.push('PAYMENT');

      const newBalance: number =
        Number(transaction.amount) +
        transaction.walletRechargeOrder.wallet.balance;
      await Promise.all([
        queryRunner.manager.update(Transaction, transaction.id, {
          status: TransactionStatus.COMPLETED,
        }),
        queryRunner.manager.update(
          WalletRechargeOrder,
          transaction.walletRechargeOrder.id,
          {
            status: OrderStatus.COMPLETED,
          },
        ),
        queryRunner.manager.update(
          Wallet,
          transaction.walletRechargeOrder.wallet.id,
          {
            balance: newBalance,
          },
        ),
      ]);

      // update transaction and order for the data to return
      transaction.status = TransactionStatus.COMPLETED;
      transaction.walletRechargeOrder.status = OrderStatus.COMPLETED;
      transaction.walletRechargeOrder.wallet.balance = newBalance;

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
    this.logger.error(`Wallet recharge payment failed: ${errorMessage}`);

    const transaction = await this.transactionsRepository.findEntityData(
      transactionOrTransactionId,
      { hotelBookingOrder: true },
    );

    this.transactionsRepository.update(transaction.id, {
      status: TransactionStatus.FAILED,
      errorMessage,
    });
  }
}
