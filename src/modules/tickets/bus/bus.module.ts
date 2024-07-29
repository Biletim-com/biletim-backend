import { Module } from '@nestjs/common';

import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { BiletAllService } from './services/biletall/biletall.service';
import { BiletAllParser } from './services/biletall/biletall.parser';
import { BusController } from './bus.controller';
import { StopPoint } from './models/stop-point.entity';
import { StopPointsRepository } from './repositories/stop-points.repository';
import { BusService } from './services/bus.service';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([StopPoint])],
  controllers: [BusController],
  providers: [
    BiletAllApiConfigService,
    BiletAllService,
    BiletAllParser,
    StopPointsRepository,
    BusService,
  ],
  exports: [BiletAllService],
})
export class BusModule {}
