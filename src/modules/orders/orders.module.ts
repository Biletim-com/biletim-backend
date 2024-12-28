import { Module } from '@nestjs/common';

import { HotelBookingOrderModule } from './hotel-booking/hotel-booking-order.module';
import { BusTicketOrdersModule } from './bus-ticket/bus-ticket-orders.module';
import { PlaneTicketOrdersModule } from './plane-ticket/plane-ticket-orders.module';
import { WalletRechargeOrderModule } from './wallet-recharge-order/wallet-recharge-order.module';

@Module({
  imports: [
    PlaneTicketOrdersModule,
    HotelBookingOrderModule,
    BusTicketOrdersModule,
    WalletRechargeOrderModule,
  ],
})
export class OrdersModule {}
