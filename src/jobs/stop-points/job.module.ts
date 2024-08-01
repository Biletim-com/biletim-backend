import { Module } from '@nestjs/common';

import { BiletAllService } from '@app/modules/tickets/bus/services/biletall/biletall.service';
import { BusTerminalsRepository } from '@app/modules/tickets/bus/repositories/bus-terminals.repository';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { BiletAllParser } from '@app/modules/tickets/bus/services/biletall/biletall.parser';

import { StopPointsCronJobService } from './job.service';

@Module({
  providers: [
    StopPointsCronJobService,
    BiletAllService,
    BusTerminalsRepository,
    BiletAllApiConfigService,
    BiletAllParser,
  ],
})
export class StopPointsCronJobModule {}
