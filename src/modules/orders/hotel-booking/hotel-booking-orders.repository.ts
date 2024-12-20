import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';
import { HotelBookingOrder } from './entities/hotel-booking-order.entity';

@Injectable()
export class HotelBookingOrdersRepository extends AbstractRepository<HotelBookingOrder> {
  constructor(private dataSource: DataSource) {
    super(HotelBookingOrder, dataSource.createEntityManager());
  }
}
