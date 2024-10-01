import { Module } from '@nestjs/common';

import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { BiletAllBusService } from './services/biletall/biletall-bus.service';
import { BiletAllParser } from './services/biletall/biletall-bus.parser';
import { BusController } from './bus.controller';
import { BusTerminal } from './entities/bus-terminal.entity';
import { BusTerminalRepository } from './repositories/bus-terminal.repository';
import { BusService } from './services/bus.service';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([BusTerminal])],
  controllers: [BusController],
  providers: [
    BusService,
    BiletAllApiConfigService,
    BiletAllBusService,
    BiletAllParser,
    BusTerminalRepository,
  ],
  exports: [BiletAllBusService],
})
export class BusModule {}
