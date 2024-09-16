import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Airport } from '../entities/airport.entity';

@Injectable()
export class AirportRepository extends Repository<Airport> {
  constructor(private dataSource: DataSource) {
    super(Airport, dataSource.createEntityManager());
  }
}
