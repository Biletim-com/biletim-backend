import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';

import { Passenger } from './passenger.entity';

@Injectable()
export class PassengersRepository extends AbstractRepository<Passenger> {
  constructor(dataSource: DataSource) {
    super(Passenger, dataSource.createEntityManager());
  }
}
