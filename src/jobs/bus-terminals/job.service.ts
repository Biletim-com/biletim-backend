import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { BusTerminal } from '@app/modules/tickets/bus/entities/bus-terminal.entity';
import { BusTerminalRepository } from '@app/modules/tickets/bus/repositories/bus-terminal.repository';
import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';

// dto
import { BusTerminalDto } from '@app/modules/tickets/bus/dto/bus-terminal.dto';

@Injectable()
export class BusTerminalsCronJobService implements OnModuleInit {
  private readonly chunkSize = 500;
  private readonly logger = new Logger(BusTerminalsCronJobService.name);

  constructor(
    private readonly biletAllBusService: BiletAllBusService,
    private readonly busTerminalRepository: BusTerminalRepository,
  ) {}

  onModuleInit() {
    this.saveBusTerminalsToDb();
  }

  private splitIntoChunks = (array: BusTerminalDto[]): BusTerminalDto[][] => {
    const chunks: BusTerminalDto[][] = [];
    for (let i = 0; i < array.length; i += this.chunkSize) {
      chunks.push(array.slice(i, i + this.chunkSize));
    }
    return chunks;
  };

  private async fetchBusStopPointsDataFromBiletAll(): Promise<
    BusTerminalDto[][]
  > {
    try {
      this.logger.log('Fetching data from BiletAll');
      const response = await this.biletAllBusService.busTerminals();
      return this.splitIntoChunks(response);
    } catch (error) {
      this.logger.error('Error fetching data from BiletAll', error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async saveBusTerminalsToDb() {
    try {
      const busStopPointsChunks =
        await this.fetchBusStopPointsDataFromBiletAll();
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

        this.busTerminalRepository.upsert(entities, {
          conflictPaths: ['externalId'],
          skipUpdateIfNoValuesChanged: true,
        });
      });
    } catch (error) {
      this.logger.error('Error saving bus terminals to DB', error);
    }
  }
}
