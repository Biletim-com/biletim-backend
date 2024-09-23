import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';

import { PanelUser } from './panel-user.entity';

@Injectable()
export class PanelUsersRepository extends AbstractRepository<PanelUser> {
  constructor(private dataSource: DataSource) {
    super(PanelUser, dataSource.createEntityManager());
  }
}
