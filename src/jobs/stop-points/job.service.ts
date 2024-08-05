import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { BusTerminal } from '@app/modules/tickets/bus/models/bus-terminal.entity';
import { BusTerminalsRepository } from '@app/modules/tickets/bus/repositories/bus-terminals.repository';
import { BiletAllService } from '@app/modules/tickets/bus/services/biletall/biletall.service';

// dto
import { BusStopPointDto } from '@app/modules/tickets/bus/dto/bus-stop-point.dto';

@Injectable()
export class StopPointsCronJobService implements OnModuleInit {
  private readonly chunkSize = 500;
  private readonly logger = new Logger(StopPointsCronJobService.name);
  constructor(
    private readonly biletAllBusService: BiletAllService,
    private readonly busTerminalsRepository: BusTerminalsRepository,
  ) {}

  onModuleInit() {
    this.saveBusTerminalsToDb();
  }

  private splitIntoChunks = (array: BusStopPointDto[]): BusStopPointDto[][] => {
    const chunks: BusStopPointDto[][] = [];
    for (let i = 0; i < array.length; i += this.chunkSize) {
      chunks.push(array.slice(i, i + this.chunkSize));
    }
    return chunks;
  };

  private async fetchBusStopPointsDataFromBiletAll(): Promise<
    BusStopPointDto[][]
  > {
    try {
      this.logger.log('Fetching data from BiletAll');
      const response = await this.biletAllBusService.stopPoints();
      return this.splitIntoChunks(response);
    } catch (error) {
      this.logger.error('Error fetching data from BiletAll', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async saveBusTerminalsToDb() {
    const busStopPointsChunks = await this.fetchBusStopPointsDataFromBiletAll();
    try {
      this.logger.log('Saving Bus Terminals to DB');
      busStopPointsChunks.forEach((busStopPointsChunk) => {
        const entities = busStopPointsChunk.map((busStopPoint) => {
          const {
            id,
            cityId,
            countryCode,
            region,
            name,
            description,
            isCenter,
            affiliatedCenterId,
            appearInSearch,
          } = busStopPoint;

          return new BusTerminal({
            externalId: Number(id),
            cityId: Number(cityId),
            countryCode,
            region,
            name,
            description,
            isCenter,
            affiliatedCenterId: Number(affiliatedCenterId),
            appearInSearch,
          });
        });

        this.busTerminalsRepository.upsert(entities, {
          conflictPaths: ['externalId'],
          skipUpdateIfNoValuesChanged: true,
        });
      });
    } catch (error) {
      this.logger.error('Error saving bus terminals to DB', error);
    }
  }
}
