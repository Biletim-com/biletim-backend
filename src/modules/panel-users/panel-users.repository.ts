import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PanelUser } from './panel-users.entity';

@Injectable()
export class PanelUserRepository extends Repository<PanelUser> {
  constructor(private dataSource: DataSource) {
    super(PanelUser, dataSource.createEntityManager());
  }
}
