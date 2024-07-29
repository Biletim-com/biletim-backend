import { Injectable } from '@nestjs/common';

import { StopPointsRepository } from '../repositories/stop-points.repository';
import { StopPoint } from '../models/stop-point.entity';

@Injectable()
export class BusService {
  constructor(private readonly stopPointsRepostiory: StopPointsRepository) {}

  public async getStopPointsByName(searchTerm: string): Promise<StopPoint[]> {
    const formattedSearchTerm = searchTerm
      .split(' ')
      .map((term) => `${term}:*`)
      .join(' & ');

    return this.stopPointsRepostiory
      .createQueryBuilder('stop_points')
      .where("stop_points.name_text @@ to_tsquery('simple', :name)")
      .setParameters({ name: formattedSearchTerm })
      .getMany();
  }
}
