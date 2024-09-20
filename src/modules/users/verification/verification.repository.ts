import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Verification } from './verification.entity';

@Injectable()
export class VerificationsRepository extends Repository<Verification> {
  constructor(private dataSource: DataSource) {
    super(Verification, dataSource.createEntityManager());
  }
}
