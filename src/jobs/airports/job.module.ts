import { Module } from '@nestjs/common';

import { BiletAllPlaneService } from '@app/modules/tickets/plane/services/biletall/biletall-plane.service';
import { BiletAllPlaneParserService } from '@app/modules/tickets/plane/services/biletall/biletall-plane-parser.service';
import { AirportRepository } from '@app/modules/tickets/plane/repositories/airport.repository';

import { AirportsCronJobService } from './job.service';

@Module({
  providers: [
    AirportsCronJobService,
    BiletAllPlaneService,
    BiletAllPlaneParserService,
    AirportRepository,
  ],
})
export class AirportsCronJobModule {}
