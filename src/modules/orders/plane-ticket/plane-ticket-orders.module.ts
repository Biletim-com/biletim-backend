import { Module } from '@nestjs/common';

// providers
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

// entities
import { PlaneTicketOrder } from './entities/plane-ticket-order.entity';
import { PlaneTicket } from './entities/plane-ticket.entity';
import { PlaneTicketPassenger } from './entities/plane-ticket-passenger.entity';
import { PlaneTicketSegment } from './entities/plane-ticket-segment.entity';

// repositories
import { PlaneTicketOrdersRepository } from './plane-ticket-orders.repository';

@Module({
  imports: [
    PostgreSQLProviderModule.forFeature([
      PlaneTicket,
      PlaneTicketPassenger,
      PlaneTicketSegment,
      PlaneTicketOrder,
    ]),
  ],
  providers: [PlaneTicketOrdersRepository],
  exports: [PlaneTicketOrdersRepository],
})
export class PlaneTicketOrdersModule {}
