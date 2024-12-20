import { Module } from '@nestjs/common';

// providers
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

// entities
import { HotelBookingOrder } from './entities/hotel-booking-order.entity';
import { HotelBookingRoom } from './entities/hotel-booking-room.entity';
import { HotelRoomGuest } from './entities/hotel-room-guest.entity';

// repositories
import { HotelBookingOrdersRepository } from './hotel-booking-orders.repository';

@Module({
  imports: [
    PostgreSQLProviderModule.forFeature([
      HotelRoomGuest,
      HotelBookingRoom,
      HotelBookingOrder,
    ]),
  ],
  providers: [HotelBookingOrdersRepository],
  exports: [HotelBookingOrdersRepository],
})
export class HotelBookingOrderModule {}
