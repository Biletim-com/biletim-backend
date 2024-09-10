import { Module } from '@nestjs/common';

import { BiletAllService } from '@app/modules/tickets/bus/services/biletall/biletall.service';
import { BusTerminalRepository } from '@app/modules/tickets/bus/repositories/bus-terminal.repository';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { BiletAllParser } from '@app/modules/tickets/bus/services/biletall/biletall.parser';

import { BusTerminalsCronJobService } from './job.service';

@Module({
  providers: [
    BusTerminalsCronJobService,
    BiletAllService,
    BusTerminalRepository,
    BiletAllApiConfigService,
    BiletAllParser,
  ],
})
export class BusTerminalsCronJobModule {}
