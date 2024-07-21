import { Module } from '@nestjs/common';

import { AppConfigService } from '@app/configs/app/config.service';

import { BiletAllService } from './biletall.service';
import { BiletAllController } from './biletall.controller';

@Module({
  controllers: [BiletAllController],
  providers: [BiletAllService, AppConfigService],
  exports: [BiletAllService],
})
export class BiletAllModule {}
