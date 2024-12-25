import { Injectable } from '@nestjs/common';

// services
import { BusTicketPaymentResultProcessingStrategy } from '../strategies/bus-ticket-payment-processing.strategy';
import { PlaneTicketPaymentProcessingStrategy } from '../strategies/plane-ticket-payment-processing.strategy';
import { HotelBookingPaymentProcessingStrategy } from '../strategies/hotel-booking-payment-processing.strategy';

// interfaces
import { IPaymentProcessingStrategy } from '../interfaces/payment-processing.strategy.interface';

// enums
import { TicketType } from '@app/common/enums';

// errors
import { ServiceError } from '@app/common/errors';

@Injectable()
export class PaymentProcessingFactory {
  private readonly strategies: Map<TicketType, IPaymentProcessingStrategy> =
    new Map();

  constructor(
    busTicketPaymentProcessingStrategy: BusTicketPaymentResultProcessingStrategy,
    planeTicketPaymentProcessingStrategy: PlaneTicketPaymentProcessingStrategy,
    hotelBookingPaymentProcessingStrategy: HotelBookingPaymentProcessingStrategy,
  ) {
    this.strategies.set(TicketType.BUS, busTicketPaymentProcessingStrategy);
    this.strategies.set(TicketType.PLANE, planeTicketPaymentProcessingStrategy);
    this.strategies.set(
      TicketType.HOTEL,
      hotelBookingPaymentProcessingStrategy,
    );
  }

  getStrategy(ticketType: TicketType): IPaymentProcessingStrategy {
    const strategy = this.strategies.get(ticketType);
    if (!strategy) {
      throw new ServiceError(ticketType);
    }
    return strategy;
  }
}
