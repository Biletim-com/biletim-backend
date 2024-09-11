import { Injectable } from '@nestjs/common';

import { BusTerminalRepository } from '../repositories/bus-terminal.repository';
import { BusTerminal } from '../entities/bus-terminal.entity';

@Injectable()
export class BusService {
  constructor(private readonly busTerminalRepostiory: BusTerminalRepository) {}

  public async getBusTerminalsByName(
    searchTerm: string,
  ): Promise<BusTerminal[]> {
    const formattedSearchTerm = searchTerm
      .split(' ')
      .map((term) => `${term}:*`)
      .join(' & ');

    return this.busTerminalRepostiory
      .createQueryBuilder('bus_terminals')
      .where("bus_terminals.name_text @@ to_tsquery('simple', :name)")
      .andWhere('bus_terminals.appear_in_search = true')
      .setParameters({ name: formattedSearchTerm })
      .getMany();
  }
}
