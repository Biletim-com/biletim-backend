import { Module } from '@nestjs/common';

// services
import { PlaneTicketOutputHandlerService } from './services/plane-ticket-output-handler.service';

@Module({
  providers: [PlaneTicketOutputHandlerService],
})
export class TicketsModule {}
