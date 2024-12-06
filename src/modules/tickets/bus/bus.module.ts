import { Module } from '@nestjs/common';

import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';
import { BiletAllBusModule } from '@app/providers/ticket/biletall/bus/provider.module';

import { BusTerminal } from './entities/bus-terminal.entity';
import { BusTerminalRepository } from './repositories/bus-terminal.repository';
import { BusController } from './bus.controller';

import { BusService } from './services/bus.service';

@Module({
  imports: [
    PostgreSQLProviderModule.forFeature([BusTerminal]),
    BiletAllBusModule,
  ],
  controllers: [BusController],
  providers: [BusService, BusTerminalRepository],
})
export class BusModule {}
