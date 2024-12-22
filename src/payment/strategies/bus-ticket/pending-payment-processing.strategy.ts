import { BadRequestException, Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

// strategies
import { BaseBusTicketPaymentProcessingStrategy } from './base-bus-ticket-payment-processing.strategy';

// interface
import { IBusTicketPaymentProcessingStrategy } from '../../interfaces/bus-ticket-payment-processing.strategy.interface';

// factories
import { PaymentProviderFactory } from '@app/providers/payment/payment-provider.factory';

// entites
import { Transaction } from '@app/modules/transactions/transaction.entity';

// services
import { BiletAllBusTicketPurchaseService } from '@app/providers/ticket/biletall/bus/services/biletall-bus-ticket-purchase.service';
import { BiletAllBusSearchService } from '@app/providers/ticket/biletall/bus/services/biletall-bus-search.service';

// dto
import { VakifBankPaymentResultDto } from '@app/providers/payment/vakif-bank/dto/vakif-bank-payment-result.dto';

// enums
import { PaymentProvider } from '@app/common/enums';

// types
import { PaymentProcessingActions } from '@app/payment/types/payment-processing-actions.type';
import { BusSeatAvailabilityRequestDto } from '@app/search/bus/dto/bus-seat-availability.dto';

@Injectable()
export class PendingPaymentProcessingStrategy
  extends BaseBusTicketPaymentProcessingStrategy
  implements IBusTicketPaymentProcessingStrategy
{
  constructor(
    private readonly paymentProviderFactory: PaymentProviderFactory,
    private readonly biletAllBusSearchService: BiletAllBusSearchService,
    private readonly biletAllBusTicketPurchaseService: BiletAllBusTicketPurchaseService,
  ) {
    super();
  }

  async handleTicketPayment(
    queryRunner: QueryRunner,
    clientIp: string,
    transaction: Transaction,
    paymentResultDetails: VakifBankPaymentResultDto,
  ): Promise<void> {
    const {
      companyNumber,
      routeNumber,
      tripTrackingNumber,
      departureTerminal,
      arrivalTerminal,
      travelStartDateTime,
    } = transaction.busTicketOrder;

    const actionsCompleted: PaymentProcessingActions = [];
    const paymentProvider = this.paymentProviderFactory.getStrategy(
      PaymentProvider.VAKIF_BANK,
    );

    try {
      /**
       * check ticket validity against biletall
       */
      const busSeatAvailabilityDto = new BusSeatAvailabilityRequestDto({
        companyNumber,
        routeNumber,
        tripTrackingNumber,
        departurePointId: String(departureTerminal.externalId),
        arrivalPointId: String(arrivalTerminal.externalId),
        travelStartDateTime,
        seats: transaction.busTicketOrder.tickets.map((ticket) => ({
          gender: ticket.passenger.gender,
          seatNumber: ticket.seatNumber,
        })),
      });

      const busSeatAvailability =
        await this.biletAllBusSearchService.busSeatAvailability(
          clientIp,
          busSeatAvailabilityDto,
        );

      if (!busSeatAvailability.isAvailable) {
        throw new BadRequestException('Seat(s) are not available anymore');
      }

      /**
       * finalize payment
       */
      await paymentProvider.finishPayment({
        clientIp,
        details: {
          ...paymentResultDetails,
          PurchAmount: transaction.amount,
        },
        orderId: transaction.busTicketOrder.id,
      });
      actionsCompleted.push('PAYMENT');

      /**
       * send purchase request to biletall
       */
      const { pnr, ticketNumbers } =
        await this.biletAllBusTicketPurchaseService.purchaseTicket(
          clientIp,
          transaction,
          transaction.busTicketOrder,
          transaction.busTicketOrder.tickets,
        );
      actionsCompleted.push('TICKET_SALE');

      await this.updateDatabaseWithPaymentResults(
        queryRunner,
        transaction,
        ticketNumbers,
        pnr,
      );
    } catch (err) {
      if (actionsCompleted.includes('PAYMENT')) {
        paymentProvider.cancelPayment({
          clientIp,
          transactionId: transaction.id,
        });
      }
      if (actionsCompleted.includes('TICKET_SALE')) {
        console.log('cancel with PNR number');
      }
      throw err;
    }
  }
}
