import { Module } from '@nestjs/common';

import { BiletAllBusModule } from '@app/providers/ticket/biletall/bus/provider.module';

import { BusSearchController } from './bus-search.controller';

@Module({
  imports: [BiletAllBusModule],
  controllers: [BusSearchController],
})
export class BusSearchModule {}
