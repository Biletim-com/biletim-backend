import { Module } from '@nestjs/common';

// modules
import { BiletAllCommonModule } from '@app/providers/ticket/biletall/common/provider.module';
import { HotelSearchModule } from './hotel/hotel-search.module';

// controllers
import { SearchGeneralController } from './search-general.controller';

@Module({
  imports: [BiletAllCommonModule, HotelSearchModule],
  controllers: [SearchGeneralController],
})
export class SearchModule {}
