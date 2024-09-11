import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BusTerminal } from '../entities/bus-terminal.entity';

@Injectable()
export class BusTerminalRepository extends Repository<BusTerminal> {
  constructor(private dataSource: DataSource) {
    super(BusTerminal, dataSource.createEntityManager());
  }
}
