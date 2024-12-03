import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';

import { Passport } from './passport.entity';

@Injectable()
export class PassportsRepository extends AbstractRepository<Passport> {
  constructor(dataSource: DataSource) {
    super(Passport, dataSource.createEntityManager());
  }
}
