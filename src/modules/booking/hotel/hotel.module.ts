import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { HotelApiConfigService } from '@app/configs/hotel-api';

import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';

@Module({
  imports: [HttpModule],
  controllers: [HotelController],
  providers: [HotelService, HotelApiConfigService],
})
export class HotelModule {}
