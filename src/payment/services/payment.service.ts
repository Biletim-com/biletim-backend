import { Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';

import { PaymentProviderFactory } from '../factories/payment-provider.factory';

// entities
import { Order } from '@app/modules/orders/order.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { BusTicket } from '@app/modules/tickets/bus/entities/bus-ticket.entity';

// enums
import {
  Currency,
  PaymentMethod,
  PaymentProvider,
  TransactionStatus,
  TransactionType,
} from '@app/common/enums';

// utils
import { normalizeDecimal } from '@app/common/utils';

// dtos
import { BusTicketPurchaseDto } from '@app/common/dtos';
import { BusTerminal } from '@app/modules/tickets/bus/entities/bus-terminal.entity';

@Injectable()
export class PaymentService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly paymentProviderFactory: PaymentProviderFactory,
  ) {}

  async busTicketPurchase(
    busTicketPurchaseDto: BusTicketPurchaseDto,
  ): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const busTerminals = await queryRunner.manager.findBy(BusTerminal, {
      id: In([
        busTicketPurchaseDto.departureTerminalId,
        busTicketPurchaseDto.arrivalTerminalId,
      ]),
    });
    if (busTerminals.length !== 2) {
      throw new Error('');
    }

    // TODO: check ticket validity against biletall

    try {
      /**
       * Init Transactions
       */
      const transaction = new Transaction({
        amount: Number(normalizeDecimal(busTicketPurchaseDto.totalTicketPrice)),
        currency: Currency.TL,
        status: TransactionStatus.PENDING,
        transactionType: TransactionType.PURCHASE,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        // unregistered card
        cardholderName: busTicketPurchaseDto.creditCard.holderName,
        maskedPan: busTicketPurchaseDto.creditCard.maskedPan,

        creditCard: null,
        wallet: null,
      });
      await queryRunner.manager.insert(Transaction, transaction);

      /**
       * Create Order
       */
      const order = new Order({
        userEmail: busTicketPurchaseDto.email,
        user: null,
        transaction,
      });
      await queryRunner.manager.insert(Order, order);

      /**
       * Create Bus ticket and assign the order
       */
      const busTickets = busTicketPurchaseDto.passengers.map(
        ({
          seatNumber,
          firstName,
          lastName,
          gender,
          tcNumber,
          passportCountryCode,
          passportNumber,
          passportExpirationDate,
        }) =>
          new BusTicket({
            companyNo: busTicketPurchaseDto.companyNo,
            seatNumber,
            firstName,
            lastName,
            gender,
            travelStartDateTime: busTicketPurchaseDto.travelStartDateTime,
            tcNumber,
            passportCountryCode,
            passportNumber,
            passportExpirationDate,
            departureTerminal: busTerminals.find(
              (busTerminal) =>
                busTerminal.id === busTicketPurchaseDto.departureTerminalId,
            ),
            arrivalTerminal: busTerminals.find(
              (busTerminal) =>
                busTerminal.id === busTicketPurchaseDto.arrivalTerminalId,
            ),
            order,
          }),
      );
      await queryRunner.manager.insert(BusTicket, busTickets);

      const paymentProvider = this.paymentProviderFactory.getStrategy(
        PaymentProvider.VAKIF_BANK,
      );
      const htmlContent = await paymentProvider.startPayment(
        busTicketPurchaseDto.creditCard,
        transaction,
      );

      await queryRunner.commitTransaction();
      return htmlContent;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
