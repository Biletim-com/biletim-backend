import { Module } from '@nestjs/common';

import { BiletAllApiConfigService } from '@app/configs/bilet-all-api/config.service';
import { BiletAllService } from '@app/modules/tickets/bus/services/biletall/biletall.service';
import { BiletallPlaneParser } from '@app/modules/tickets/plane/services/biletall/biletall-plane.parser';
import { BiletallPlaneService } from '@app/modules/tickets/plane/services/biletall/biletall-plane.service';
import { BiletAllParser } from '@app/modules/tickets/bus/services/biletall/biletall.parser';
import { AirportRepository } from '@app/modules/tickets/plane/repositories/airport.repository';

import { AirportsCronJobService } from './job.service';

@Module({
  providers: [
    AirportsCronJobService,
    BiletAllService,
    BiletallPlaneService,
    BiletallPlaneParser,
    BiletAllApiConfigService,
    BiletAllParser,
    AirportRepository,
  ],
})
export class AirportsCronJobModule {}
