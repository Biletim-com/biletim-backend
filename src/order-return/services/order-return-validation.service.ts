import { Injectable } from '@nestjs/common';

// services
import { BiletAllPnrService } from '@app/providers/ticket/biletall/common/services/biletall-pnr.service';

// repositories
import { OrdersRepository } from '@app/modules/orders/orders.repository';

// entities
import { Order } from '@app/modules/orders/order.entity';
import { BusTicket } from '@app/modules/tickets/bus/entities/bus-ticket.entity';
import { PlaneTicket } from '@app/modules/tickets/plane/entities/plane-ticket.entity';

// errors
import {
  OrderAlreadyReturnedError,
  OrderNotFoundError,
} from '@app/common/errors';
import { turkishToEnglish } from '@app/common/utils';
import { OrderStatus } from '@app/common/enums';

@Injectable()
export class OrderReturnValidationService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly biletAllPnrService: BiletAllPnrService,
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
  ): Promise<Order> {
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
    return existingOrder;
  }
}
