import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';

import { Airport } from '../entities/airport.entity';

@Injectable()
export class AirportRepository extends AbstractRepository<Airport> {
  constructor(private dataSource: DataSource) {
    super(Airport, dataSource.createEntityManager());
  }
}
