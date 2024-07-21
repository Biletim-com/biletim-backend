import { Module } from '@nestjs/common';

import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';

import { BiletAllService } from './biletall.service';
import { BiletAllController } from './biletall.controller';

@Module({
  controllers: [BiletAllController],
  providers: [BiletAllService, BiletAllApiConfigService],
  exports: [BiletAllService],
})
export class BiletAllModule {}
