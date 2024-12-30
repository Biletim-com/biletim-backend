import { Module } from '@nestjs/common';

// modules
import { BiletAllCommonModule } from '@app/providers/ticket/biletall/common/provider.module';
import { BusSearchModule } from './bus/bus-search.module';
import { PlaneSearchModule } from './plane/plane-search.module';
import { HotelSearchModule } from './hotel/hotel-search.module';

// controllers
import { SearchGeneralController } from './search-general.controller';

@Module({
  imports: [
    BiletAllCommonModule,
    BusSearchModule,
    PlaneSearchModule,
    HotelSearchModule,
  ],
  controllers: [SearchGeneralController],
})
export class SearchModule {}
