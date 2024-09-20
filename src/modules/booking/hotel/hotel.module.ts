import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { HotelApiConfigService } from '@app/configs/hotel-api';

import { HotelController } from './hotel.controller';
import { HotelService } from './services/ratehawk/hotel.service';
import { RatehawkHotelService } from './services/ratehawk/hotel-ratehawk.service';

@Module({
  imports: [HttpModule],
  controllers: [HotelController],
  providers: [HotelService, RatehawkHotelService, HotelApiConfigService],
})
export class HotelModule {}
