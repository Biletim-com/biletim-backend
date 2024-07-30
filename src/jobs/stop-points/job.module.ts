import { Module } from '@nestjs/common';

import { BiletAllService } from '@app/modules/tickets/bus/services/biletall/biletall.service';
import { StopPointsRepository } from '@app/modules/tickets/bus/repositories/stop-points.repository';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { BiletAllParser } from '@app/modules/tickets/bus/services/biletall/biletall.parser';

import { StopPointsCronJobService } from './job.service';

@Module({
  providers: [
    StopPointsCronJobService,
    BiletAllService,
    StopPointsRepository,
    BiletAllApiConfigService,
    BiletAllParser,
  ],
})
export class StopPointsCronJobModule {}
