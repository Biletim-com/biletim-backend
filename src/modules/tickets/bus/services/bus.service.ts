import { Injectable } from '@nestjs/common';

import { BusTerminalsRepository } from '../repositories/bus-terminals.repository';
import { BusTerminal } from '../models/bus-terminal.entity';

@Injectable()
export class BusService {
  constructor(
    private readonly busTerminalsRepostiory: BusTerminalsRepository,
  ) {}

  public async getBusTerminalsByName(
    searchTerm: string,
  ): Promise<BusTerminal[]> {
    const formattedSearchTerm = searchTerm
      .split(' ')
      .map((term) => `${term}:*`)
      .join(' & ');

    return this.busTerminalsRepostiory
      .createQueryBuilder('bus_terminals')
      .where("bus_terminals.name_text @@ to_tsquery('simple', :name)")
      .setParameters({ name: formattedSearchTerm })
      .getMany();
  }
}
