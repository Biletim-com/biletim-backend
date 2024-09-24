import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { BusModule } from './bus/bus.module';
import { PlaneModule } from './plane/plane.module';
import { TicketsParser } from './tickets.parser';
import { BiletAllService } from './bus/services/biletall/biletall-bus.service';
import { BiletAllParser } from './bus/services/biletall/biletall-bus.parser';

@Module({
  imports: [BusModule, PlaneModule],
  providers: [TicketsService, BiletAllService, BiletAllParser, TicketsParser],
  controllers: [TicketsController],
})
export class TicketsModule {}
