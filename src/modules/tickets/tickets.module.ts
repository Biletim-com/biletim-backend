import { Module } from '@nestjs/common';

// services
import { PlaneTicketOutputHandlerService } from './services/plane-ticket-output-handler.service';
import { TicketController } from './tickets.controller';
import { PlaneTicketOrdersRepository } from '../orders/plane-ticket/plane-ticket-orders.repository';

@Module({
  providers: [PlaneTicketOutputHandlerService, PlaneTicketOrdersRepository],
  controllers: [TicketController],
})
export class TicketsModule {}
