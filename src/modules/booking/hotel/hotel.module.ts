import { Module } from '@nestjs/common';

import { HotelController } from './hotel.controller';
import { HotelService } from './services/ratehawk/hotel.service';
import { RatehawkHotelService } from './services/ratehawk/hotel-ratehawk.service';

@Module({
  controllers: [HotelController],
  providers: [HotelService, RatehawkHotelService],
})
export class HotelModule {}
