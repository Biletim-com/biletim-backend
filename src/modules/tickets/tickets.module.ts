import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { BusModule } from './bus/bus.module';
import { PlaneModule } from './plane/plane.module';
import { TicketsParser } from './tickets.parser';
import { BiletAllBusService } from './bus/services/biletall/biletall-bus.service';
import { BiletAllParser } from './bus/services/biletall/biletall-bus.parser';

@Module({
  imports: [BusModule, PlaneModule],
  providers: [
    TicketsService,
    BiletAllBusService,
    BiletAllParser,
    TicketsParser,
  ],
  controllers: [TicketsController],
})
export class TicketsModule {}
