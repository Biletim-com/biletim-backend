import { Module } from '@nestjs/common';

import { HotelSearchController } from './hotel-search.controller';
import { HotelBookingOrdersRepository } from '@app/modules/orders/hotel-booking/hotel-booking-orders.repository';
import { HotelProviderModule } from '@app/providers/hotel/provider.module';

@Module({
  imports: [HotelProviderModule],
  providers: [HotelBookingOrdersRepository],
  controllers: [HotelSearchController],
})
export class HotelSearchModule {}
