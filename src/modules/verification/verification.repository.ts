import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';

import { Verification } from './verification.entity';

@Injectable()
export class VerificationsRepository extends AbstractRepository<Verification> {
  constructor(private dataSource: DataSource) {
    super(Verification, dataSource.createEntityManager());
  }
}
