import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

import { BusTerminal } from './entities/bus-terminal.entity';
import { BusTerminalRepository } from './repositories/bus-terminal.repository';
import { BusController } from './bus.controller';

import { BiletAllService } from '@app/common/services/biletall.service';
import { BiletAllBusService } from './services/biletall/biletall-bus.service';
import { BiletAllBusParserService } from './services/biletall/biletall-bus-parser.service';
import { BusService } from './services/bus.service';

@Module({
  imports: [PostgreSQLProviderModule.forFeature([BusTerminal])],
  controllers: [BusController],
  providers: [
    BusService,
    BiletAllBusService,
    BiletAllService,
    BiletAllBusParserService,
    BusTerminalRepository,
  ],
  exports: [BiletAllBusService],
})
export class BusModule {}
