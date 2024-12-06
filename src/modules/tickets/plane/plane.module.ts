import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { BiletAllPlaneModule } from '@app/providers/ticket/biletall/plane/provider.module';

import { Airport } from './entities/airport.entity';
import { AirportRepository } from './repositories/airport.repository';
import { PlaneController } from './plane.controller';

import { PlaneService } from './services/plane.service';

@Module({
  imports: [
    PostgreSQLProviderModule.forFeature([Airport]),
    BiletAllPlaneModule,
  ],
  controllers: [PlaneController],
  providers: [PlaneService, AirportRepository],
})
export class PlaneModule {}
