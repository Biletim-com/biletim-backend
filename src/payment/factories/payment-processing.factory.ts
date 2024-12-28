import { Injectable } from '@nestjs/common';

// services
import { BusTicketPaymentResultProcessingStrategy } from '../strategies/bus-ticket-payment-processing.strategy';
import { PlaneTicketPaymentProcessingStrategy } from '../strategies/plane-ticket-payment-processing.strategy';
import { HotelBookingPaymentProcessingStrategy } from '../strategies/hotel-booking-payment-processing.strategy';
import { WalletRechargePaymentProcessingStrategy } from '../strategies/wallet-recharge-payment-processing.strategy';

// interfaces
import { IPaymentProcessingStrategy } from '../interfaces/payment-processing.strategy.interface';

// enums
import { PaymentFlowType } from '@app/common/enums';

// errors
import { ServiceError } from '@app/common/errors';

@Injectable()
export class PaymentProcessingFactory {
  private readonly strategies: Map<
    PaymentFlowType,
    IPaymentProcessingStrategy
  > = new Map();

  constructor(
    busTicketPaymentProcessingStrategy: BusTicketPaymentResultProcessingStrategy,
    planeTicketPaymentProcessingStrategy: PlaneTicketPaymentProcessingStrategy,
    hotelBookingPaymentProcessingStrategy: HotelBookingPaymentProcessingStrategy,
    walletRechargePaymentProcessingStrategy: WalletRechargePaymentProcessingStrategy,
  ) {
    this.strategies.set(
      PaymentFlowType.BUS_TICKET,
      busTicketPaymentProcessingStrategy,
    );
    this.strategies.set(
      PaymentFlowType.PLANE_TICKET,
      planeTicketPaymentProcessingStrategy,
    );
    this.strategies.set(
      PaymentFlowType.HOTEL_BOOKING,
      hotelBookingPaymentProcessingStrategy,
    );
    this.strategies.set(
      PaymentFlowType.WALLET_RECHARGE,
      walletRechargePaymentProcessingStrategy,
    );
  }

  getStrategy(ticketType: PaymentFlowType): IPaymentProcessingStrategy {
    const strategy = this.strategies.get(ticketType);
    if (!strategy) {
      throw new ServiceError(ticketType);
    }
    return strategy;
  }
}
