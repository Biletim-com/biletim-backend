import { Module } from '@nestjs/common';

import { TicketsService } from './services/tickets.service';
import { TicketsController } from './tickets.controller';

// modules
import { BusModule } from './bus/bus.module';
import { PlaneModule } from './plane/plane.module';

// services
import { BiletAllPnrService } from './services/biletall/biletall-pnr.service';
import { BiletAllPnrParserService } from './services/biletall/biletall-pnr-parser.service';

@Module({
  imports: [BusModule, PlaneModule],
  providers: [TicketsService, BiletAllPnrService, BiletAllPnrParserService],
  controllers: [TicketsController],
})
export class TicketsModule {}
