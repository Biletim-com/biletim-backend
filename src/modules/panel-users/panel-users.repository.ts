import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PanelUser } from './panel-user.entity';

@Injectable()
export class PanelUsersRepository extends Repository<PanelUser> {
  constructor(private dataSource: DataSource) {
    super(PanelUser, dataSource.createEntityManager());
  }
}
