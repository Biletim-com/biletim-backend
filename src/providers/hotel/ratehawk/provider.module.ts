import { Module } from '@nestjs/common';

import { MongoDBProviderModule } from '@app/providers/database/mongodb/provider.module';
import { HotelDocument, HotelSchema } from './models/hotel.schema';

// services
import { RatehawkSearchService } from './services/ratehawk-search.service';
import { RatehawkOrderBookingService } from './services/ratehawk-order-booking.service';
import { RatehawkOrderCancelService } from './services/ratehawk-order-cancel.service';
import { RatehawkRequestService } from './services/ratehawk-request.service';
import { RatehawkStaticHotelDataService } from './services/ratehawk-static-hotel-data.service';

import { HotelRepository } from './hotel.repository';
import { HotelOrderStatusWebhookController } from './hotel-order-status-webhook.controller';
import { HotelBookingOrdersRepository } from '@app/modules/orders/repositories/hotel-booking-orders.repository';

@Module({
  imports: [
    MongoDBProviderModule.forFeature([
      { name: HotelDocument.name, schema: HotelSchema },
    ]),
  ],
  controllers: [HotelOrderStatusWebhookController],
  providers: [
    HotelBookingOrdersRepository,
    RatehawkSearchService,
    RatehawkOrderBookingService,
    RatehawkOrderCancelService,
    RatehawkRequestService,
    RatehawkStaticHotelDataService,
    HotelRepository,
  ],
  exports: [
    RatehawkSearchService,
    RatehawkOrderBookingService,
    RatehawkOrderCancelService,
    RatehawkStaticHotelDataService,
    HotelRepository,
  ],
})
export class RatehawkProviderModule {}
