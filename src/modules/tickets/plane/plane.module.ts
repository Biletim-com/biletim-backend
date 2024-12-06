import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { BiletAllPlaneModule } from '@app/providers/ticket/biletall/plane/provider.module';

import { Airport } from './entities/airport.entity';
import { AirportRepository } from './repositories/airport.repository';
import { PlaneController } from './plane.controller';

import { AirportsService } from './services/airports.service';

@Module({
  imports: [
    PostgreSQLProviderModule.forFeature([Airport]),
    BiletAllPlaneModule,
  ],
  controllers: [PlaneController],
  providers: [AirportsService, AirportRepository],
})
export class PlaneModule {}
