import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { HotelModule } from 'src/booking/hotel/hotel.module';

@Module({
  imports: [HotelModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
