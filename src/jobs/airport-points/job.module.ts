import { BiletAllApiConfigService } from '@app/configs/bilet-all-api/config.service';
import { BiletAllService } from '@app/modules/tickets/bus/services/biletall/biletall.service';
import { BiletallPlaneParser } from '@app/modules/tickets/plane/services/biletall/biletall-plane.parser';
import { BiletallPlaneService } from '@app/modules/tickets/plane/services/biletall/biletall-plane.service';

import { Module } from '@nestjs/common';
import { AirportPointsCronJobService } from './job.service';
import { BiletAllParser } from '@app/modules/tickets/bus/services/biletall/biletall.parser';
import { AirportPointsRepository } from '@app/modules/tickets/plane/repositories/airport-points.repository';

@Module({
  providers: [
    AirportPointsCronJobService,
    BiletAllService,
    BiletallPlaneService,
    BiletallPlaneParser,
    BiletAllApiConfigService,
    BiletAllParser,
    AirportPointsRepository,
  ],
})
export class AirportPointsCronJobModule {}
