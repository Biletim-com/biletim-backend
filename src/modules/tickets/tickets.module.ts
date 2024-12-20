import { Module } from '@nestjs/common';

// modules
import { BusModule } from './bus/bus.module';
import { PlaneModule } from './plane/plane.module';
import { BiletAllCommonModule } from '@app/providers/ticket/biletall/common/provider.module';

// services
import { PlaneTicketOutputHandlerService } from './services/plane-ticket-output-handler.service';

@Module({
  imports: [BusModule, PlaneModule, BiletAllCommonModule],
  providers: [PlaneTicketOutputHandlerService],
})
export class TicketsModule {}
