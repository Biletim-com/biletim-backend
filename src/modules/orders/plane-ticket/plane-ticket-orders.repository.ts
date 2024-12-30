import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';
import { PlaneTicketOrder } from './entities/plane-ticket-order.entity';

@Injectable()
export class PlaneTicketOrdersRepository extends AbstractRepository<PlaneTicketOrder> {
  constructor(private dataSource: DataSource) {
    super(PlaneTicketOrder, dataSource.createEntityManager());
  }
}
