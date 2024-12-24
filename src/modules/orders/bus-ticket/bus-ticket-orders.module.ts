import { Module } from '@nestjs/common';

// providers
import { PostgreSQLProviderModule } from '@app/providers/database/postgresql/provider.module';

// entities
import { BusTicketOrder } from './entities/bus-ticket-order.entity';
import { BusTicket } from './entities/bus-ticket.entity';
import { BusTicketPassenger } from './entities/bus-ticket-passenger.entity';

// repositories
import { BusTicketOrdersRepository } from './bus-ticket-orders.repository';

// services
import { BusTicketOrderService } from './bus-ticket-order.service';

// controller
import { BusTicketOrderController } from './bus-ticket-order.controller';

@Module({
  imports: [
    PostgreSQLProviderModule.forFeature([
      BusTicket,
      BusTicketPassenger,
      BusTicketOrder,
    ]),
  ],
  controllers: [BusTicketOrderController],
  providers: [BusTicketOrdersRepository, BusTicketOrderService],
  exports: [BusTicketOrdersRepository, BusTicketOrderService],
})
export class BusTicketOrdersModule {}
