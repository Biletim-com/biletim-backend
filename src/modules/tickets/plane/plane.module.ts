import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { Airport } from './entities/airport.entity';
import { PlaneController } from './plane.controller';

import { BiletAllService } from '@app/common/services/biletall.service';
import { BiletAllPlaneService } from './services/biletall/biletall-plane.service';
import { BiletAllPlaneParserService } from './services/biletall/biletall-plane-parser.service';
import { PlaneService } from './services/plane.service';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([Airport])],
  controllers: [PlaneController],
  providers: [
    PlaneService,
    BiletAllPlaneParserService,
    BiletAllService,
    BiletAllPlaneService,
  ],
})
export class PlaneModule {}
