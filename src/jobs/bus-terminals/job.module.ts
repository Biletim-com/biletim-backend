import { Module } from '@nestjs/common';

import { BusTerminalsCronJobService } from './job.service';
import { BiletAllBusModule } from '@app/providers/ticket/biletall/bus/provider.module';

@Module({
  imports: [BiletAllBusModule],
  providers: [BusTerminalsCronJobService],
})
export class BusTerminalsCronJobModule {}
