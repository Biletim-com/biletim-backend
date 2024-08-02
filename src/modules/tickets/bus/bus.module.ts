import { Module } from '@nestjs/common';

import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { BiletAllService } from './services/biletall/biletall.service';
import { BiletAllParser } from './services/biletall/biletall.parser';
import { BusController } from './bus.controller';
import { BusTerminal } from './models/bus-terminal.entity';
import { BusTerminalsRepository } from './repositories/bus-terminals.repository';
import { BusService } from './services/bus.service';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([BusTerminal])],
  controllers: [BusController],
  providers: [
    BiletAllApiConfigService,
    BiletAllService,
    BiletAllParser,
    BusTerminalsRepository,
    BusService,
  ],
  exports: [BiletAllService],
})
export class BusModule {}
