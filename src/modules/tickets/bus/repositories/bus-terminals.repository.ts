import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { BusTerminal } from '../models/bus-terminal.entity';

@Injectable()
export class BusTerminalsRepository extends Repository<BusTerminal> {
  constructor(private dataSource: DataSource) {
    super(BusTerminal, dataSource.createEntityManager());
  }
}
