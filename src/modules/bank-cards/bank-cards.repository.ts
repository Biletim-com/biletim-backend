import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';

import { BankCard } from './bank-card.entity';

@Injectable()
export class BankCardsRepository extends AbstractRepository<BankCard> {
  constructor(private dataSource: DataSource) {
    super(BankCard, dataSource.createEntityManager());
  }
}
