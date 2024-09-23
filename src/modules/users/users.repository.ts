import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';

import { User } from './user.entity';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}
