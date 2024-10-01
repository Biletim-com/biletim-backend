import { Module } from '@nestjs/common';

import { BiletAllApiConfigService } from '@app/configs/bilet-all-api/config.service';
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { PlaneController } from './plane.controller';
import { BiletAllBusService } from '../bus/services/biletall/biletall-bus.service';
import { BiletAllParser } from '../bus/services/biletall/biletall-bus.parser';
import { BiletallPlaneService } from './services/biletall/biletall-plane.service';
import { BiletallPlaneParser } from './services/biletall/biletall-plane.parser';
import { PlaneService } from './services/plane.service';
import { Airport } from './entities/airport.entity';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([Airport])],
  controllers: [PlaneController],
  providers: [
    PlaneService,
    BiletAllBusService,
    BiletallPlaneParser,
    BiletAllApiConfigService,
    BiletAllParser,
    BiletallPlaneService,
  ],
})
export class PlaneModule {}
