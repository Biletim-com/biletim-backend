import { Module } from '@nestjs/common';

import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';
import { BiletAllBusParserService } from '@app/modules/tickets/bus/services/biletall/biletall-bus-parser.service';
import { BusTerminalRepository } from '@app/modules/tickets/bus/repositories/bus-terminal.repository';

import { BusTerminalsCronJobService } from './job.service';

@Module({
  providers: [
    BusTerminalsCronJobService,
    BiletAllBusService,
    BiletAllBusParserService,
    BusTerminalRepository,
  ],
})
export class BusTerminalsCronJobModule {}
