import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';

import { CreditCard } from './credit-card.entity';

@Injectable()
export class CreditCardsRepository extends AbstractRepository<CreditCard> {
  constructor(private dataSource: DataSource) {
    super(CreditCard, dataSource.createEntityManager());
  }
}
