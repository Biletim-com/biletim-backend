import { Module } from '@nestjs/common';

import { MongoDBProviderModule } from '@app/providers/database/mongodb/provider.module';

// schemas
import {
  HotelReviewsDocument,
  HotelReviewsSchema,
} from './models/hotel-reviews.schema';
import { HotelDocument, HotelSchema } from './models/hotel.schema';

// services
import { RatehawkSearchService } from './services/ratehawk-search.service';
import { RatehawkOrderBookingService } from './services/ratehawk-order-booking.service';
import { RatehawkOrderCancelService } from './services/ratehawk-order-cancel.service';
import { RatehawkRequestService } from './services/ratehawk-request.service';
import { RatehawkStaticHotelDataService } from './services/ratehawk-static-hotel-data.service';

// controllers
import { RatehawkWebhookController } from './ratehawk-webhook.controller';

// repositories
import { HotelBookingOrdersRepository } from '@app/modules/orders/hotel-booking/hotel-booking-orders.repository';
import { HotelRepository } from './repositories/hotel.repository';
import { HotelReviewsRepository } from './repositories/hotel-reviews.repository';

@Module({
  imports: [
    MongoDBProviderModule.forFeature([
      { name: HotelDocument.name, schema: HotelSchema },
      { name: HotelReviewsDocument.name, schema: HotelReviewsSchema },
    ]),
  ],
  controllers: [RatehawkWebhookController],
  providers: [
    HotelBookingOrdersRepository,
    RatehawkSearchService,
    RatehawkOrderBookingService,
    RatehawkOrderCancelService,
    RatehawkRequestService,
    RatehawkStaticHotelDataService,
    HotelRepository,
    HotelReviewsRepository,
  ],
  exports: [
    RatehawkSearchService,
    RatehawkOrderBookingService,
    RatehawkOrderCancelService,
    RatehawkStaticHotelDataService,
    HotelRepository,
    HotelReviewsRepository,
  ],
})
export class RatehawkProviderModule {}
