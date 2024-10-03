import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { HotelController } from './hotel.controller';
import { HotelService } from './services/ratehawk/hotel.service';
import { RatehawkHotelService } from './services/ratehawk/hotel-ratehawk.service';

@Module({
  imports: [HttpModule],
  controllers: [HotelController],
  providers: [HotelService, RatehawkHotelService],
})
export class HotelModule {}
