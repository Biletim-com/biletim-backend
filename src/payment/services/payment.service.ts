import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';

import { PaymentProviderFactory } from '../factories/payment-provider.factory';
import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';

// entities
import { Order } from '@app/modules/orders/order.entity';
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { BusTicket } from '@app/modules/tickets/bus/entities/bus-ticket.entity';
import { BusTerminal } from '@app/modules/tickets/bus/entities/bus-terminal.entity';

// enums
import {
  Currency,
  PaymentMethod,
  PaymentProvider,
  TransactionStatus,
  TransactionType,
} from '@app/common/enums';

// dtos
import { BusTicketPurchaseDto } from '../dto/bus-ticket-purchase.dto';
import { BusSeatAvailabilityRequestDto } from '@app/modules/tickets/bus/dto/bus-seat-availability.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly paymentProviderFactory: PaymentProviderFactory,
    private readonly biletAllBusService: BiletAllBusService,
  ) {}

  async busTicketPurchase(
    clientIp: string,
    busTicketPurchaseDto: BusTicketPurchaseDto,
  ): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const [departureTerminal, arrivalTerminal] =
      await queryRunner.manager.findBy(BusTerminal, {
        id: In([
          busTicketPurchaseDto.departureTerminalId,
          busTicketPurchaseDto.arrivalTerminalId,
        ]),
      });

    if (!departureTerminal || !arrivalTerminal) {
      throw new BadRequestException('Bus Terminal(s) do not exist');
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

    // const paymentProviderType = transactionRules.includes(
    //   'BILETALL_VIRTUAL_POS',
    // )
    //   ? PaymentProvider.BILET_ALL
    //   : PaymentProvider.VAKIF_BANK;

    const paymentProviderType = PaymentProvider.VAKIF_BANK;

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
        userPhoneNumber: busTicketPurchaseDto.phoneNumber,
        user: null,
        transaction,
      });
      await queryRunner.manager.insert(Order, order);

      console.log({
        travelStartDateTime: busTicketPurchaseDto.travelStartDateTime,
      });

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
        busTicketPurchaseDto.creditCard,
        { ...transaction, order: { ...order, busTickets } },
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
