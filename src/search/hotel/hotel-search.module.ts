import { Module } from '@nestjs/common';

import { HotelSearchController } from './hotel-search.controller';
import { RatehawkProviderModule } from '@app/providers/hotel/ratehawk/provider.module';
import { HotelBookingOrdersRepository } from '@app/modules/orders/repositories/hotel-booking-orders.repository';

@Module({
  imports: [RatehawkProviderModule],
  providers: [HotelBookingOrdersRepository],
  controllers: [HotelSearchController],
})
export class HotelSearchModule {}
