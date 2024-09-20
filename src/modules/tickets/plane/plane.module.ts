import { Module } from '@nestjs/common';

import { BiletAllApiConfigService } from '@app/configs/bilet-all-api/config.service';
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { PlaneController } from './plane.controller';
import { BiletAllService } from '../bus/services/biletall/biletall.service';
import { BiletAllParser } from '../bus/services/biletall/biletall.parser';
import { BiletallPlaneService } from './services/biletall/biletall-plane.service';
import { BiletallPlaneParser } from './services/biletall/biletall-plane.parser';
import { PlaneService } from './services/plane.service';
import { Airport } from './entities/airport.entity';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([Airport])],
  controllers: [PlaneController],
  providers: [
    PlaneService,
    BiletAllService,
    BiletallPlaneParser,
    BiletAllApiConfigService,
    BiletAllParser,
    BiletallPlaneService,
  ],
})
export class PlaneModule {}
