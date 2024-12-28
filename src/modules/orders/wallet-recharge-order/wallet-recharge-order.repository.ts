import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';
import { WalletRechargeOrder } from './wallet-recharge-order.entity';

@Injectable()
export class WalletRechargeOrdersRepository extends AbstractRepository<WalletRechargeOrder> {
  constructor(private dataSource: DataSource) {
    super(WalletRechargeOrder, dataSource.createEntityManager());
  }
}
