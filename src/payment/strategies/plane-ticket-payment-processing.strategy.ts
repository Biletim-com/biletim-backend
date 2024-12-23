import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

// services
import { EventEmitterService } from '@app/providers/event-emitter/provider.service';
import { BiletAllPlaneTicketPurchaseService } from '@app/providers/ticket/biletall/plane/services/biletall-plane-ticket-purchase.service';

// repositories
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';
import { PlaneTicketOrdersRepository } from '@app/modules/orders/plane-ticket/plane-ticket-orders.repository';

// entities
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { PlaneTicket } from '@app/modules/orders/plane-ticket/entities/plane-ticket.entity';
import { PlaneTicketOrder } from '@app/modules/orders/plane-ticket/entities/plane-ticket-order.entity';

// factories
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';

// interfaces
import { IPaymentProcessingStrategy } from '../interfaces/payment-processing.strategy.interface';

// dto
import { VakifBankPaymentResultDto } from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';

// enums
import {
  OrderStatus,
  PlaneTicketOperationType,
  TransactionStatus,
} from '@app/common/enums';

// types
import { UUID } from '@app/common/types';
import { PaymentProcessingActions } from '../types/payment-processing-actions.type';

// errors
import { TransactionNotFoundError } from '@app/common/errors';

@Injectable()
export class PlaneTicketPaymentProcessingStrategy
  implements IPaymentProcessingStrategy
{
  private readonly logger = new Logger(
    PlaneTicketPaymentProcessingStrategy.name,
  );

  constructor(
    private readonly dataSource: DataSource,
    private readonly eventEmitterService: EventEmitterService,
    private readonly paymentProviderFactory: PaymentProviderFactory,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly planeTicketOrdersRepository: PlaneTicketOrdersRepository,
    private readonly biletAllPlaneTicketPurchaseService: BiletAllPlaneTicketPurchaseService,
  ) {}

  async handlePayment(
    clientIp: string,
    transactionId: UUID,
    paymentResultDto: VakifBankPaymentResultDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: {
        id: transactionId,
      },
      relations: {
        planeTicketOrder: {
          tickets: {
            passenger: true,
          },
          segments: {
            departureAirport: true,
            arrivalAirport: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new TransactionNotFoundError();
    }
    transaction.planeTicketOrder.tickets.sort(
      (a, b) => a.ticketOrder - b.ticketOrder,
    );
    transaction.planeTicketOrder.segments.sort(
      (a, b) => a.segmentOrder - b.segmentOrder,
    );

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
        orderId: transaction.planeTicketOrder.id,
        details: {
          ...paymentResultDto,
          PurchAmount: transaction.amount,
        },
      });
      actionsCompleted.push('PAYMENT');

      /**
       * send purchase request to biletall
       */
      const { pnr, ticketNumbers } =
        await this.biletAllPlaneTicketPurchaseService.processPlaneTicket(
          clientIp,
          PlaneTicketOperationType.PURCHASE,
          transaction.amount,
          transaction.planeTicketOrder,
          transaction.planeTicketOrder.tickets,
          transaction.planeTicketOrder.segments,
        );
      actionsCompleted.push('TICKET_SALE');

      await Promise.all([
        ...transaction.planeTicketOrder.tickets.map(
          (sortedPlaneTicket, index: number) => {
            const ticketNumber = ticketNumbers[index];
            // update tickets for the data to return
            sortedPlaneTicket.ticketNumber = ticketNumber;

            // update ticket numbers
            return queryRunner.manager.update(
              PlaneTicket,
              sortedPlaneTicket.id,
              {
                ticketNumber,
              },
            );
          },
        ),
        queryRunner.manager.update(Transaction, transaction.id, {
          status: TransactionStatus.COMPLETED,
        }),
        queryRunner.manager.update(
          PlaneTicketOrder,
          transaction.planeTicketOrder.id,
          {
            status: OrderStatus.COMPLETED,
            pnr,
          },
        ),
      ]);

      // update transaction and order for the data to return
      transaction.status = TransactionStatus.COMPLETED;
      transaction.planeTicketOrder.status = OrderStatus.COMPLETED;
      transaction.planeTicketOrder.pnr = pnr;

      /** SEND EVENTS */
      this.eventEmitterService.emitEvent(
        'ticket.plane.purchased',
        transaction.planeTicketOrder,
      );

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
      if (actionsCompleted.includes('TICKET_SALE')) {
        console.log('cancel with PNR number');
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
    this.logger.error(`Plane ticket payment failed: ${errorMessage}`);

    const transaction = await this.transactionsRepository.findEntityData(
      transactionOrTransactionId,
      { planeTicketOrder: true },
    );

    Promise.all([
      this.transactionsRepository.update(transaction.id, {
        status: TransactionStatus.FAILED,
        errorMessage,
      }),
      this.planeTicketOrdersRepository.update(transaction.planeTicketOrder.id, {
        status: OrderStatus.PAYMENT_FAILED,
      }),
    ]);
  }
}
