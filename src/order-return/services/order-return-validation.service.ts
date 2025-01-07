import { Injectable } from '@nestjs/common';

// services
import { BiletAllPnrService } from '@app/providers/ticket/biletall/common/services/biletall-pnr.service';
import { BiletAllPlaneTicketReturnService } from '@app/providers/ticket/biletall/plane/services/biletall-plane-ticket-return.service';
import { OrderRepositoryFactoryService } from '../factories/order-repository.factory.service';
import { RatehawkOrderCancelService } from '@app/providers/hotel/ratehawk/services/ratehawk-order-cancel.service';

// entities
import { PlaneTicket } from '@app/modules/orders/plane-ticket/entities/plane-ticket.entity';
import { BusTicket } from '@app/modules/orders/bus-ticket/entities/bus-ticket.entity';

// errors
import {
  OrderCannotBeReturnedError,
  OrderNotFoundError,
  OrderReturnDeadlineExpiredError,
  ServiceError,
} from '@app/common/errors';
import { normalizeDecimal, turkishToEnglish } from '@app/common/utils';
import { OrderStatus, OrderType } from '@app/common/enums';

// dto
import { OrderReturnValidationDto } from '../dto/order-return-validation.dto';
import { OrderReturnTotalPenaltyDto } from '@app/common/dtos';

// validators
import { isNumeric } from '@app/common/validators';

@Injectable()
export class OrderReturnValidationService {
  constructor(
    private readonly orderRepositoryFactoryService: OrderRepositoryFactoryService,
    private readonly biletAllPnrService: BiletAllPnrService,
    private readonly biletAllPlaneTicketReturnService: BiletAllPlaneTicketReturnService,
    private readonly ratehawkOrderCancelService: RatehawkOrderCancelService,
  ) {}

  private getFirstPassengerSurname(
    tickets: BusTicket[] | PlaneTicket[],
  ): string {
    const getSurname = (tickets: BusTicket[] | PlaneTicket[]) =>
      tickets.sort(
        (a: BusTicket | PlaneTicket, b: BusTicket | PlaneTicket) =>
          a.ticketOrder - b.ticketOrder,
      )[0]?.passenger?.lastName || '';

    const firstPassengerSurname = getSurname(tickets);
    return turkishToEnglish(firstPassengerSurname).toUpperCase();
  }

  public async validateOrderWithPnrNumber(
    pnrNumber: string,
    passengerLastName: string,
    orderType: OrderType.BUS_TICKET | OrderType.PLANE_TICKET,
  ): Promise<OrderReturnValidationDto> {
    const transformedPassengerLastName =
      turkishToEnglish(passengerLastName).toUpperCase();
    const ordersRepository =
      this.orderRepositoryFactoryService.getRepository(orderType);

    const existingOrder = await ordersRepository.findOne({
      where: {
        pnr: pnrNumber,
      },
      relations: {
        transaction: true,
        tickets: {
          passenger: true,
        },
      },
    });

    if (!existingOrder) {
      throw new OrderNotFoundError();
    }

    const firstPassengerSurname = this.getFirstPassengerSurname(
      existingOrder.tickets,
    );

    if (transformedPassengerLastName !== firstPassengerSurname) {
      throw new OrderNotFoundError();
    }
    if (existingOrder.status !== OrderStatus.COMPLETED) {
      throw new OrderCannotBeReturnedError(existingOrder.status);
    }

    await this.biletAllPnrService.pnrSearch({
      pnrNumber: pnrNumber,
      pnrSearcParameter: firstPassengerSurname,
    });

    const penalty: OrderReturnTotalPenaltyDto = {
      totalTicketPrice: existingOrder.transaction.amount,
      servicePenaltyAmount: '0',
      companyPenaltyAmount: '0',
      totalPenaltyAmount: '0',
      amountToRefund: existingOrder.transaction.amount,
    };

    if (orderType === OrderType.PLANE_TICKET) {
      const { passengers } =
        await this.biletAllPlaneTicketReturnService.ticketReturnPenalty(
          pnrNumber,
          passengerLastName,
        );
      passengers.forEach((passenger) => {
        const biletimFee = Number(
          (
            existingOrder.tickets.find(
              (ticket) => ticket.ticketNumber === passenger.ticketNumber,
            ) as PlaneTicket
          ).biletimFee,
        );
        penalty.servicePenaltyAmount = normalizeDecimal(
          Number(normalizeDecimal(penalty.servicePenaltyAmount)) +
            Number(normalizeDecimal(passenger.providerPenaltyAmount)) +
            biletimFee,
        );
        penalty.companyPenaltyAmount = normalizeDecimal(
          Number(normalizeDecimal(penalty.companyPenaltyAmount)) +
            Number(normalizeDecimal(passenger.companyPenaltyAmount)),
        );
        penalty.totalPenaltyAmount = normalizeDecimal(
          Number(normalizeDecimal(penalty.totalPenaltyAmount)) +
            Number(normalizeDecimal(passenger.totalPenaltyAmount)) +
            biletimFee,
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

  private async validateHotelOrder(
    reservationNumber: string,
  ): Promise<OrderReturnValidationDto> {
    if (!isNumeric(reservationNumber)) {
      throw new ServiceError('Reservation number has to be number');
    }

    const ordersRepository = this.orderRepositoryFactoryService.getRepository(
      OrderType.HOTEL_BOOKING,
    );

    const existingOrder = await ordersRepository.findOne({
      where: {
        reservationNumber: Number(reservationNumber),
      },
      relations: {
        transaction: true,
      },
    });

    if (!existingOrder) {
      throw new OrderNotFoundError();
    }

    // if (
    //   existingOrder.status !== OrderStatus.COMPLETED &&
    //   existingOrder.status !== OrderStatus.REJECTED
    // ) {
    //   throw new OrderCannotBeReturnedError(existingOrder.status);
    // }

    if (Date.now() > new Date(existingOrder.checkoutDateTime).getTime()) {
      throw new OrderReturnDeadlineExpiredError();
    }

    const penalty = this.ratehawkOrderCancelService.orderReturnPenalty(
      existingOrder.cancellationPenalties,
      existingOrder.transaction.amount,
    );

    return {
      ...existingOrder,
      penalty,
    };
  }

  public validateOrder(
    reservationNumber: string,
    passengerLastName: string,
    orderType: OrderType,
  ) {
    if (
      orderType === OrderType.BUS_TICKET ||
      orderType === OrderType.PLANE_TICKET
    ) {
      return this.validateOrderWithPnrNumber(
        reservationNumber,
        passengerLastName,
        orderType,
      );
    } else {
      return this.validateHotelOrder(reservationNumber);
    }
  }
}
