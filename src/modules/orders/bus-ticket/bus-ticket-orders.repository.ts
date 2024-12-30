import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';
import { BusTicketOrder } from './entities/bus-ticket-order.entity';

@Injectable()
export class BusTicketOrdersRepository extends AbstractRepository<BusTicketOrder> {
  constructor(private dataSource: DataSource) {
    super(BusTicketOrder, dataSource.createEntityManager());
  }
}
