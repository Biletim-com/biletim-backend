import { Module } from '@nestjs/common';

import { BiletAllApiConfigService } from '@app/configs/bilet-all-api/config.service';
import { BiletallPlaneParser } from '@app/modules/tickets/plane/services/biletall/biletall-plane.parser';
import { BiletallPlaneService } from '@app/modules/tickets/plane/services/biletall/biletall-plane.service';
import { AirportRepository } from '@app/modules/tickets/plane/repositories/airport.repository';

import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';
import { BiletAllParser } from '@app/modules/tickets/bus/services/biletall/biletall-bus.parser';

import { AirportsCronJobService } from './job.service';

@Module({
  providers: [
    AirportsCronJobService,
    BiletallPlaneService,
    BiletallPlaneParser,
    BiletAllApiConfigService,
    AirportRepository,
    BiletAllBusService,
    BiletAllParser,
  ],
})
export class AirportsCronJobModule {}
