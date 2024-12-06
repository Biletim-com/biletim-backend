import { Module } from '@nestjs/common';

import { BiletAllPlaneModule } from '@app/providers/ticket/biletall/plane/provider.module';
import { AirportRepository } from '@app/modules/tickets/plane/repositories/airport.repository';

import { AirportsCronJobService } from './job.service';

@Module({
  imports: [BiletAllPlaneModule],
  providers: [AirportsCronJobService, AirportRepository],
})
export class AirportsCronJobModule {}
