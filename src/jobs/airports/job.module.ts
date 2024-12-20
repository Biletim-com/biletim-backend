import { Module } from '@nestjs/common';

import { BiletAllPlaneModule } from '@app/providers/ticket/biletall/plane/provider.module';

import { AirportsCronJobService } from './job.service';

@Module({
  imports: [BiletAllPlaneModule],
  providers: [AirportsCronJobService],
})
export class AirportsCronJobModule {}
