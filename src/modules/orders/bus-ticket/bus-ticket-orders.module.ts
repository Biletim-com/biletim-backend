import { Module } from '@nestjs/common';

// providers
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

// entities
import { BusTicketOrder } from './entities/bus-ticket-order.entity';
import { BusTicket } from './entities/bus-ticket.entity';
import { BusTicketPassenger } from './entities/bus-ticket-passenger.entity';

// repositories
import { BusTicketOrdersRepository } from './bus-ticket-orders.repository';

@Module({
  imports: [
    PostgreSQLProviderModule.forFeature([
      BusTicket,
      BusTicketPassenger,
      BusTicketOrder,
    ]),
  ],
  providers: [BusTicketOrdersRepository],
  exports: [BusTicketOrdersRepository],
})
export class BusTicketOrdersModule {}
