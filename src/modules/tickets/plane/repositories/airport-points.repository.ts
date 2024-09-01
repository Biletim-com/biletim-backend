import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AirportPoints } from '../models/airport-points.entity';

@Injectable()
export class AirportPointsRepository extends Repository<AirportPoints> {
  constructor(private dataSource: DataSource) {
    super(AirportPoints, dataSource.createEntityManager());
  }
}
