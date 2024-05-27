import { Module } from '@nestjs/common';
import { BiletAllService } from './biletall.service';
import { BiletAllController } from './biletall.controller';

@Module({
  controllers: [BiletAllController],
  providers: [BiletAllService],
  exports: [BiletAllService],
})
export class BiletAllModule {}
