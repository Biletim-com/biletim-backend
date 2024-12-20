import { Injectable } from '@nestjs/common';

import { BusTerminalRepository } from '../repositories/bus-terminal.repository';
import { BusTerminal } from '../entities/bus-terminal.entity';

@Injectable()
export class BusTerminalsService {
  constructor(private readonly busTerminalRepository: BusTerminalRepository) {}

  public async searchBusTerminals(searchTerm: string): Promise<BusTerminal[]> {
    const formattedSearchTerm = searchTerm
      .split(' ')
      .map((term) => `${term}:*`)
      .join(' & ');

    return this.busTerminalRepository
      .createQueryBuilder('bus_terminals')
      .where("bus_terminals.search_text @@ to_tsquery('simple', :name)")
      .andWhere('bus_terminals.appear_in_search = true')
      .setParameters({ name: formattedSearchTerm })
      .getMany();
  }
}
