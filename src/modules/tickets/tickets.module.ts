import { Module } from '@nestjs/common';

import { TicketsController } from './tickets.controller';

// modules
import { BusModule } from './bus/bus.module';
import { PlaneModule } from './plane/plane.module';
import { BiletAllCommonModule } from '@app/providers/ticket/biletall/common/provider.module';

// services
import { PlaneTicketOutputHandlerService } from './services/plane-ticket-output-handler.service';
import { OrdersRepository } from '../orders/orders.repository';

@Module({
  imports: [BusModule, PlaneModule, BiletAllCommonModule],
  providers: [OrdersRepository, PlaneTicketOutputHandlerService],
  controllers: [TicketsController],
})
export class TicketsModule {}
