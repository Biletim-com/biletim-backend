import { Module } from '@nestjs/common';

import { HotelSearchController } from './hotel-search.controller';
import { RatehawkProviderModule } from '@app/providers/hotel/ratehawk/provider.module';

@Module({
  imports: [RatehawkProviderModule],
  controllers: [HotelSearchController],
})
export class HotelSearchModule {}
