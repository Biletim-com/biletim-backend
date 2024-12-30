import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AbstractRepository } from '@app/common/database/postgresql/abstract.repository';

import { BusTerminal } from '../entities/bus-terminal.entity';

@Injectable()
export class BusTerminalRepository extends AbstractRepository<BusTerminal> {
  constructor(private dataSource: DataSource) {
    super(BusTerminal, dataSource.createEntityManager());
  }
}
