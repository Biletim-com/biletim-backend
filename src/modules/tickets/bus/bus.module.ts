import { Module } from '@nestjs/common';

import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';

import { BiletAllBusService } from './services/biletall/biletall-bus.service';
import { BiletAllBusParser } from './services/biletall/biletall-bus.parser';
import { BusController } from './bus.controller';

@Module({
  controllers: [BusController],
  providers: [BiletAllBusService, BiletAllBusParser, BiletAllApiConfigService],
  exports: [BiletAllBusService],
})
export class BusModule {}
