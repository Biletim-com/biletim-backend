import { Injectable } from '@nestjs/common';

import { AirportRepository } from '../repositories/airport.repository';
import { Airport } from '../entities/airport.entity';

@Injectable()
export class AirportsService {
  constructor(private readonly airportRepository: AirportRepository) {}

  public async searchAirports(searchTerm: string): Promise<Airport[]> {
    const formattedSearchTerm = searchTerm
      .split(' ')
      .map((term) => `${term}:*`)
      .join(' & ');

    return this.airportRepository
      .createQueryBuilder('airports')
      .where("airports.search_text @@ to_tsquery('simple', :name)")
      .setParameters({ name: formattedSearchTerm })
      .getMany();
  }
}
