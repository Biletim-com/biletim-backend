import { Module } from '@nestjs/common';

import { HotelBookingOrderModule } from './hotel-booking/hotel-booking-order.module';
import { BusTicketOrdersModule } from './bus-ticket/bus-ticket-orders.module';
import { PlaneTicketOrdersModule } from './plane-ticket/plane-ticket-orders.module';

@Module({
  imports: [
    PlaneTicketOrdersModule,
    HotelBookingOrderModule,
    BusTicketOrdersModule,
  ],
})
export class OrdersModule {}
