import { Module } from '@nestjs/common';

// providers
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

// entities
import { HotelBookingOrder } from './entities/hotel-booking-order.entity';
import { HotelBookingRoom } from './entities/hotel-booking-room.entity';
import { HotelRoomGuest } from './entities/hotel-room-guest.entity';

// repositories
import { HotelBookingOrdersRepository } from './hotel-booking-orders.repository';

// services
import { HotelBookingOrderService } from './hotel-booking-order.service';

// controller
import { HotelBookingOrderController } from './hotel-booking-order.controller';

@Module({
  imports: [
    PostgreSQLProviderModule.forFeature([
      HotelRoomGuest,
      HotelBookingRoom,
      HotelBookingOrder,
    ]),
  ],
  controllers: [HotelBookingOrderController],
  providers: [HotelBookingOrdersRepository, HotelBookingOrderService],
  exports: [HotelBookingOrdersRepository, HotelBookingOrderService],
})
export class HotelBookingOrderModule {}
