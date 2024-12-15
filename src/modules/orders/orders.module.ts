import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { Order } from './order.entity';
import { HotelBookingOrder } from './entites/hotel-booking-order.entity';
import { HotelBookingRoom } from './entites/hotel-booking-room.entity';
import { HotelRoomGuest } from './entites/hotel-room-guest.entity';

import { OrdersRepository } from './orders.repository';
import { HotelBookingOrdersRepository } from './repositories/hotel-booking-orders.repository';

@Module({
  imports: [
    PostgreSQLProviderModule.forFeature([
      Order,
      HotelRoomGuest,
      HotelBookingRoom,
      HotelBookingOrder,
    ]),
  ],
  providers: [OrdersRepository, HotelBookingOrdersRepository],
})
export class TransactionsModule {}
