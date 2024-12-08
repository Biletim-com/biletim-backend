import { Injectable } from '@nestjs/common';

// services
import { BiletAllPnrService } from '@app/providers/ticket/biletall/common/services/biletall-pnr.service';
import { BiletAllPlaneTicketReturnService } from '@app/providers/ticket/biletall/plane/services/biletall-plane-ticket-return.service';

// repositories
import { OrdersRepository } from '@app/modules/orders/orders.repository';

// entities
import { BusTicket } from '@app/modules/tickets/bus/entities/bus-ticket.entity';
import { PlaneTicket } from '@app/modules/tickets/plane/entities/plane-ticket.entity';

// errors
import {
  OrderAlreadyReturnedError,
  OrderNotFoundError,
} from '@app/common/errors';
import { normalizeDecimal, turkishToEnglish } from '@app/common/utils';
import { OrderStatus } from '@app/common/enums';

// dto
import {
  OrderReturnTotalPenaltyDto,
  OrderReturnValidationDto,
} from '../dto/order-return-validation.dto';

@Injectable()
export class OrderReturnValidationService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly biletAllPnrService: BiletAllPnrService,
    private readonly biletAllPlaneTicketReturnService: BiletAllPlaneTicketReturnService,
  ) {}

  private getFirstPassengerSurname(order: {
    busTickets: BusTicket[];
    planeTickets: PlaneTicket[];
  }): string {
    const getSurname = (tickets: BusTicket[] | PlaneTicket[]) =>
      tickets.sort(
        (a: BusTicket | PlaneTicket, b: BusTicket | PlaneTicket) =>
          a.ticketOrder - b.ticketOrder,
      )[0]?.passenger?.lastName || '';

    let firstPassengerSurname = '';
    if (order.busTickets.length > 0) {
      firstPassengerSurname = getSurname(order.busTickets);
    } else {
      firstPassengerSurname = getSurname(order.planeTickets);
    }

    return turkishToEnglish(firstPassengerSurname).toUpperCase();
  }

  public async validateOrderWithPnrNumber(
    pnrNumber: string,
    passengerLastName: string,
  ): Promise<OrderReturnValidationDto> {
    const transformedPassengerLastName =
      turkishToEnglish(passengerLastName).toUpperCase();
    const existingOrder = await this.ordersRepository.findOne({
      where: {
        pnr: pnrNumber,
      },
      relations: {
        transaction: true,
        busTickets: {
          passenger: true,
        },
        planeTickets: {
          passenger: true,
        },
      },
    });
    if (!existingOrder) {
      throw new OrderNotFoundError();
    }

    const firstPassengerSurname = this.getFirstPassengerSurname({
      busTickets: existingOrder.busTickets,
      planeTickets: existingOrder.planeTickets,
    });

    if (transformedPassengerLastName !== firstPassengerSurname) {
      throw new OrderNotFoundError();
    }
    if (existingOrder.status === OrderStatus.REFUND_PROCESSED) {
      throw new OrderAlreadyReturnedError();
    }

    await this.biletAllPnrService.pnrSearch({
      pnrNumber: pnrNumber,
      pnrSearcParameter: firstPassengerSurname,
    });

    const penalty: OrderReturnTotalPenaltyDto = {
      totalTicketPrice: existingOrder.transaction.amount,
      providerPenaltyAmount: '0',
      companyPenaltyAmount: '0',
      totalPenaltyAmount: '0',
      amountToRefund: existingOrder.transaction.amount,
    };

    if (existingOrder.planeTickets.length > 0) {
      const { passengers } =
        await this.biletAllPlaneTicketReturnService.ticketReturnPenalty(
          pnrNumber,
          passengerLastName,
        );

      passengers.forEach((passenger) => {
        penalty.providerPenaltyAmount = normalizeDecimal(
          Number(normalizeDecimal(penalty.providerPenaltyAmount)) +
            Number(normalizeDecimal(passenger.providerPenaltyAmount)),
        );
        penalty.companyPenaltyAmount = normalizeDecimal(
          Number(normalizeDecimal(penalty.companyPenaltyAmount)) +
            Number(normalizeDecimal(passenger.companyPenaltyAmount)),
        );
        penalty.totalPenaltyAmount = normalizeDecimal(
          Number(normalizeDecimal(penalty.totalPenaltyAmount)) +
            Number(normalizeDecimal(passenger.totalPenaltyAmount)),
        );
      });
      penalty.amountToRefund = normalizeDecimal(
        Number(normalizeDecimal(penalty.totalTicketPrice)) -
          Number(normalizeDecimal(penalty.totalPenaltyAmount)),
      );
    }

    return {
      ...existingOrder,
      penalty,
    };
  }
}
