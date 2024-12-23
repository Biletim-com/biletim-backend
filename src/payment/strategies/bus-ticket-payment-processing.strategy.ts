import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

// strategies
import { ImmediateSuccessPaymentStrategy } from './bus-ticket/immediate-success-payment.strategy';
import { PendingPaymentProcessingStrategy } from './bus-ticket/pending-payment-processing.strategy';

// abstract
import { IPaymentProcessingStrategy } from '@app/payment/interfaces/payment-processing.strategy.interface';

// interfaces
import { IBusTicketPaymentProcessingStrategy } from '../interfaces/bus-ticket-payment-processing.strategy.interface';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';

// services
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';

// repositories
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';
import { BusTicketOrdersRepository } from '@app/modules/orders/bus-ticket/bus-ticket-orders.repository';

// dto
import { BusTicketPurchaseResultDto } from '@app/providers/ticket/biletall/bus/dto/bus-ticket-purchase-result.dto';
import { VakifBankPaymentResultDto } from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';

// enums
import {
  OrderStatus,
  PaymentProvider,
  TransactionStatus,
} from '@app/common/enums';

// types
import { UUID } from '@app/common/types';

// errors
import { TransactionNotFoundError } from '@app/common/errors';

@Injectable()
export class BusTicketPaymentResultProcessingStrategy
  implements IPaymentProcessingStrategy
{
  private readonly logger = new Logger(
    BusTicketPaymentResultProcessingStrategy.name,
  );

  constructor(
    private readonly dataSource: DataSource,
    private readonly immediateSuccessStrategy: ImmediateSuccessPaymentStrategy,
    private readonly pendingPaymentStrategy: PendingPaymentProcessingStrategy,
    private readonly eventEmitterService: EventEmitterService,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly busTicketOrdersRepository: BusTicketOrdersRepository,
  ) {}

  async handlePayment(
    clientIp: string,
    transactionId: UUID,
    paymentResultDto: BusTicketPurchaseResultDto | VakifBankPaymentResultDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: {
        id: transactionId,
      },
      relations: {
        busTicketOrder: {
          departureTerminal: true,
          arrivalTerminal: true,
          tickets: {
            passenger: true,
          },
        },
      },
    });
    if (!transaction) {
      throw new TransactionNotFoundError();
    }
    transaction.busTicketOrder.tickets.sort(
      (a, b) => a.ticketOrder - b.ticketOrder,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const busTicketPaymentProcessingStrategy =
        this.getBusTicketPaymentStrategy(transaction.paymentProvider);
      await busTicketPaymentProcessingStrategy.handleTicketPayment(
        queryRunner,
        clientIp,
        transaction,
        paymentResultDto,
      );

      this.eventEmitterService.emitEvent(
        'ticket.bus.purchased',
        transaction.busTicketOrder,
      );
      await queryRunner.commitTransaction();
      return transaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();

      const errorMessage =
        err.message || 'Something went wrong while processing payment';

      await this.handlePaymentFailure(transaction, errorMessage);

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
    this.logger.error(`Bus ticket payment failed: ${errorMessage}`);

    const transaction = await this.transactionsRepository.findEntityData(
      transactionOrTransactionId,
      { busTicketOrder: true },
    );

    Promise.all([
      this.transactionsRepository.update(transaction.id, {
        status: TransactionStatus.FAILED,
        errorMessage,
      }),
      this.busTicketOrdersRepository.update(transaction.busTicketOrder.id, {
        status: OrderStatus.PAYMENT_FAILED,
      }),
    ]);
  }

  private getBusTicketPaymentStrategy(
    provider: PaymentProvider,
  ): IBusTicketPaymentProcessingStrategy {
    return provider === PaymentProvider.BILET_ALL
      ? this.immediateSuccessStrategy
      : this.pendingPaymentStrategy;
  }
}
