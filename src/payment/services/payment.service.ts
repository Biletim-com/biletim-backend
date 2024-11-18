import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, In } from 'typeorm';

import { PaymentProviderFactory } from '../factories/payment-provider.factory';
import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';
import { TransactionsRepository } from '@app/modules/transactions/transactions.repository';

// entities
import { Order } from '@app/modules/orders/order.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { BusTicket } from '@app/modules/tickets/bus/entities/bus-ticket.entity';
import { BusTerminal } from '@app/modules/tickets/bus/entities/bus-terminal.entity';

// enums
import {
  Currency,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentProvider,
  TransactionStatus,
  TransactionType,
} from '@app/common/enums';

// dtos
import { BusTicketPurchaseDto } from '../dto/bus-ticket-purchase.dto';
import { BusSeatAvailabilityRequestDto } from '@app/modules/tickets/bus/dto/bus-seat-availability.dto';

// types
import { UUID } from '@app/common/types';

@Injectable()
export class PaymentService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly paymentProviderFactory: PaymentProviderFactory,
    private readonly biletAllBusService: BiletAllBusService,
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async busTicketPurchase(
    clientIp: string,
    busTicketPurchaseDto: BusTicketPurchaseDto,
  ): Promise<{ transactionId: UUID; htmlContent: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const [departureTerminal, arrivalTerminal] =
      await queryRunner.manager.findBy(BusTerminal, {
        externalId: In([
          busTicketPurchaseDto.departureTerminalId,
          busTicketPurchaseDto.arrivalTerminalId,
        ]),
      });

    if (!departureTerminal || !arrivalTerminal) {
      throw new BadRequestException('Bus Terminal(s) do not exist');
    }

    /**
     * Validate Company via company number
     */
    const [company] = await this.biletAllBusService.company({
      companyNo: busTicketPurchaseDto.companyNo,
    });
    if (!company) {
      throw new BadRequestException('Company does not exist');
    }

    /**
     * check ticket validity against biletall
     */
    const busSeatAvailabilityDto = new BusSeatAvailabilityRequestDto({
      ...busTicketPurchaseDto,
      departurePointId: String(departureTerminal.externalId),
      arrivalPointId: String(arrivalTerminal.externalId),
      seats: busTicketPurchaseDto.passengers,
    });

    const busSeatAvailability =
      await this.biletAllBusService.busSeatAvailability(
        clientIp,
        busSeatAvailabilityDto,
      );

    if (!busSeatAvailability.isAvailable) {
      throw new BadRequestException('Seat(s) are not available anymore');
    }

    const { canSellToForeigners, transactionRules } =
      await this.biletAllBusService.getForeignSaleEligibilityAndTransactionRules(
        clientIp,
        busSeatAvailabilityDto,
      );

    if (!canSellToForeigners && busTicketPurchaseDto.foreignPassengerExists) {
      throw new BadRequestException(
        'This company does not sell tickets to foreigners',
      );
    }

    if (transactionRules.length === 0) {
      throw new BadRequestException(
        'This company does not accept online payments',
      );
    }

    const paymentProviderType = transactionRules.includes(
      'INTERNAL_VIRTUAL_POS',
    )
      ? PaymentProvider.VAKIF_BANK
      : PaymentProvider.BILET_ALL;

    try {
      /**
       * Init Transactions
       */
      const transaction = new Transaction({
        amount: busTicketPurchaseDto.totalTicketPrice,
        currency: Currency.TL,
        status: TransactionStatus.PENDING,
        transactionType: TransactionType.PURCHASE,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        paymentProvider: paymentProviderType,
        // unregistered card
        cardholderName: busTicketPurchaseDto.bankCard.holderName,
        maskedPan: busTicketPurchaseDto.bankCard.maskedPan,

        bankCard: null,
        wallet: null,
      });
      await queryRunner.manager.insert(Transaction, transaction);

      /**
       * Create Order
       */
      const order = new Order({
        firstName: busTicketPurchaseDto.firstName,
        lastName: busTicketPurchaseDto.lastName,
        userEmail: busTicketPurchaseDto.email,
        userPhoneNumber: busTicketPurchaseDto.phoneNumber,
        type: OrderType.PURCHASE,
        status: OrderStatus.PENDING,
        user: null,
        transaction,
      });
      await queryRunner.manager.insert(Order, order);

      /**
       * Create Bus ticket and assign the order
       */
      const busTickets = busTicketPurchaseDto.passengers.map(
        (
          {
            seatNumber,
            firstName,
            lastName,
            gender,
            isTurkishCitizen,
            tcNumber,
            passportCountryCode,
            passportNumber,
            passportExpirationDate,
          },
          index: number,
        ) =>
          new BusTicket({
            companyNo: busTicketPurchaseDto.companyNo,
            companyName: company.companyName,
            ticketOrder: index + 1,
            routeNumber: busTicketPurchaseDto.routeNumber,
            tripTrackingNumber: busSeatAvailabilityDto.tripTrackingNumber,
            seatNumber,
            firstName,
            lastName,
            gender,
            travelStartDateTime: busTicketPurchaseDto.travelStartDateTime,
            isTurkishCitizen,
            tcNumber,
            passportCountryCode,
            passportNumber,
            passportExpirationDate,
            departureTerminal,
            arrivalTerminal,
            order,
          }),
      );
      await queryRunner.manager.insert(BusTicket, busTickets);

      // get strategy dynamically
      const paymentProvider =
        this.paymentProviderFactory.getStrategy(paymentProviderType);

      const htmlContent = await paymentProvider.startPayment(
        clientIp,
        busTicketPurchaseDto.bankCard,
        { ...transaction, order: { ...order, busTickets } },
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

  async getTransaction(transactionId: UUID): Promise<Transaction> {
    const tranaction = await this.transactionsRepository.findOneBy({
      id: transactionId,
    });
    if (!tranaction) {
      throw new NotFoundException('Transaction is not found');
    }

    const minuteDifference =
      (new Date().getTime() - new Date(tranaction?.createdAt).getTime()) /
      (1000 * 60);

    if (minuteDifference > 3) {
      throw new BadRequestException('Transaction is expired');
    }
    return tranaction;
  }
}
