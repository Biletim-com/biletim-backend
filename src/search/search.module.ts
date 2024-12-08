import { Module } from '@nestjs/common';

// modules
import { BiletAllCommonModule } from '@app/providers/ticket/biletall/common/provider.module';

// controllers
import { SearchGeneralController } from '@app/search/controllers/search-general.controller';

@Module({
  imports: [BiletAllCommonModule],
  controllers: [SearchGeneralController],
})
export class SearchModule {}
