import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { BusModule } from './bus/bus.module';
import { PlaneModule } from './plane/plane.module';

@Module({
  imports: [BusModule, PlaneModule],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
