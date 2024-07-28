import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { BusModule } from './bus/bus.module';

@Module({
  imports: [BusModule],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
