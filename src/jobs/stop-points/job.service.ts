import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { StopPoint } from '@app/modules/tickets/bus/models/stop-point.entity';
import { StopPointsRepository } from '@app/modules/tickets/bus/repositories/stop-points.repository';
import { BiletAllService } from '@app/modules/tickets/bus/services/biletall/biletall.service';

// types
import { BiletAllStopPoint } from '@app/modules/tickets/bus/services/biletall/types/biletall-stop-points.type';

@Injectable()
export class StopPointsCronJobService implements OnModuleInit {
  private readonly chunkSize = 500;
  constructor(
    private readonly biletAllBusService: BiletAllService,
    private readonly stopPointsRepository: StopPointsRepository,
  ) {}

  onModuleInit() {
    this.fetchData();
  }

  public splitIntoChunks = (
    array: BiletAllStopPoint[],
  ): BiletAllStopPoint[][] => {
    const chunks: BiletAllStopPoint[][] = [];
    for (let i = 0; i < array.length; i += this.chunkSize) {
      chunks.push(array.slice(i, i + this.chunkSize));
    }
    return chunks;
  };

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async fetchData() {
    console.log('Fetching data from BiletAll...');
    try {
      const response = await this.biletAllBusService.stopPoints();
      const responseChunks = this.splitIntoChunks(response);

      responseChunks.forEach((responseChunk) => {
        const entities = responseChunk.map((biletAllStopPoint) => {
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
          } = biletAllStopPoint;

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
      console.error('Error fetching data from BiletAll:', error);
    }
  }
}
