import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { StopPoint } from '@app/modules/tickets/bus/models/stop-point.entity';
import { StopPointsRepository } from '@app/modules/tickets/bus/repositories/stop-points.repository';
import { BiletAllService } from '@app/modules/tickets/bus/services/biletall/biletall.service';

// types
import { BiletAllStopPoint } from '@app/modules/tickets/bus/services/biletall/types/biletall-stop-points.type';

@Injectable()
export class StopPointsCronJobService implements OnModuleInit {
  private readonly chunkSize = 500;
  private readonly logger = new Logger(StopPointsCronJobService.name);
  constructor(
    private readonly biletAllBusService: BiletAllService,
    private readonly stopPointsRepository: StopPointsRepository,
  ) {}

  onModuleInit() {
    this.saveBusTerminalsToDb();
  }

  private splitIntoChunks = (
    array: BiletAllStopPoint[],
  ): BiletAllStopPoint[][] => {
    const chunks: BiletAllStopPoint[][] = [];
    for (let i = 0; i < array.length; i += this.chunkSize) {
      chunks.push(array.slice(i, i + this.chunkSize));
    }
    return chunks;
  };

  private async fetchBusStopPointsDataFromBiletAll(): Promise<
    BiletAllStopPoint[][]
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
            ID,
            SeyahatSehirID,
            UlkeKodu,
            Bolge,
            Ad,
            Aciklama,
            MerkezMi,
            BagliOlduguNoktaID,
            AramadaGorunsun,
          } = busStopPoint;

          return new StopPoint({
            externalId: Number(ID),
            cityId: Number(SeyahatSehirID),
            countryCode: UlkeKodu,
            region: Bolge ? Bolge : null,
            name: Ad,
            description: Aciklama ? Aciklama : null,
            isCenter: MerkezMi === '1' ? true : false,
            affiliatedCenterId: Number(BagliOlduguNoktaID),
            appearInSearch: AramadaGorunsun === 'True',
          });
        });

        this.stopPointsRepository.upsert(entities, {
          conflictPaths: ['externalId'],
          skipUpdateIfNoValuesChanged: true,
        });
      });
    } catch (error) {
      this.logger.error('Error saving bus terminals to DB', error);
    }
  }
}
