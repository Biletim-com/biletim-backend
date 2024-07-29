import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { StopPoint } from '../models/stop-point.entity';

@Injectable()
export class StopPointsRepository extends Repository<StopPoint> {
  constructor(private dataSource: DataSource) {
    super(StopPoint, dataSource.createEntityManager());
  }
}
