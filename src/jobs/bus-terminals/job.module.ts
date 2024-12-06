import { Module } from '@nestjs/common';

import { BusTerminalRepository } from '@app/modules/tickets/bus/repositories/bus-terminal.repository';

import { BusTerminalsCronJobService } from './job.service';
import { BiletAllBusModule } from '@app/providers/ticket/biletall/bus/provider.module';

@Module({
  imports: [BiletAllBusModule],
  providers: [BusTerminalsCronJobService, BusTerminalRepository],
})
export class BusTerminalsCronJobModule {}
