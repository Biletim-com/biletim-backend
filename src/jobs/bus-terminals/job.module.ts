import { Module } from '@nestjs/common';

import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';
import { BiletAllParser } from '@app/modules/tickets/bus/services/biletall/biletall-bus.parser';
import { BusTerminalRepository } from '@app/modules/tickets/bus/repositories/bus-terminal.repository';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';

import { BusTerminalsCronJobService } from './job.service';

@Module({
  providers: [
    BusTerminalsCronJobService,
    BiletAllBusService,
    BusTerminalRepository,
    BiletAllApiConfigService,
    BiletAllParser,
  ],
})
export class BusTerminalsCronJobModule {}
