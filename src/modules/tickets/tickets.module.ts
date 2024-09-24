import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { BusModule } from './bus/bus.module';
import { PlaneModule } from './plane/plane.module';
import { BiletAllService } from './bus/services/biletall/biletall.service';
import { BiletAllParser } from './bus/services/biletall/biletall.parser';
import { TicketsParser } from './tickets.parser';

@Module({
  imports: [BusModule, PlaneModule],
  providers: [TicketsService, BiletAllService, BiletAllParser, TicketsParser],
  controllers: [TicketsController],
})
export class TicketsModule {}
