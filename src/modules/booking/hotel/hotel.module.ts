import { Module } from '@nestjs/common';

import { HotelController } from './hotel.controller';
import { HotelService } from './services/hotel.service';

import { MongooseModule } from '@nestjs/mongoose';
import { HotelDocument, HotelSchema } from './models/hotel.schema';
import { HotelRepository } from './hotel.repository';
import { RatehawkHotelService } from './services/ratehawk/hotel-ratehawk.service';
import { HotelHelperService } from './services/hotel-helper.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HotelDocument.name, schema: HotelSchema },
    ]),
  ],
  controllers: [HotelController],
  providers: [
    HotelService,
    HotelRepository,
    RatehawkHotelService,
    HotelHelperService,
  ],
})
export class HotelModule {}
