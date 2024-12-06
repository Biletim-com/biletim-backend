import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Airport } from '@app/modules/tickets/plane/entities/airport.entity';
import { AirportRepository } from '@app/modules/tickets/plane/repositories/airport.repository';
import { BiletAllPlaneSearchService } from '@app/providers/ticket/biletall/plane/services/biletall-plane-search.service';

// dto
import { PlaneAirportDto } from '@app/providers/ticket/biletall/plane/dto/plane-airport.dto';

@Injectable()
export class AirportsCronJobService implements OnModuleInit {
  private readonly chunkSize = 500;
  private readonly logger = new Logger(AirportsCronJobService.name);

  constructor(
    private readonly BiletAllPlaneSearchService: BiletAllPlaneSearchService,
    private readonly airportRepository: AirportRepository,
  ) {}

  onModuleInit() {
    this.saveAirportsToDb();
  }

  private splitIntoChunks = (array: PlaneAirportDto[]): PlaneAirportDto[][] => {
    const chunks: PlaneAirportDto[][] = [];
    for (let i = 0; i < array.length; i += this.chunkSize) {
      chunks.push(array.slice(i, i + this.chunkSize));
    }
    return chunks;
  };

  private async fetchAirportDataFromBiletAll(): Promise<PlaneAirportDto[][]> {
    try {
      this.logger.log('Fetching airport data from BiletAll');
      const response = await this.BiletAllPlaneSearchService.getAirports();
      return this.splitIntoChunks(response);
    } catch (error) {
      this.logger.error('Error fetching airport data from BiletAll', error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async saveAirportsToDb() {
    try {
      const airportDataChunks = await this.fetchAirportDataFromBiletAll();
      this.logger.log('Saving Airports to DB');
      airportDataChunks.forEach((airportChunk) => {
        const entities = airportChunk.map((airport) => {
          const {
            countryCode,
            countryName,
            countryNameEn,
            cityCode,
            cityName,
            cityNameEn,
            airportCode,
            airportName,
            airportNameEn,
            airportRegion,
            airportRegionEn,
          } = airport;

          return new Airport({
            countryCode,
            countryName,
            countryNameEn,
            cityCode,
            cityName,
            cityNameEn,
            airportCode,
            airportName,
            airportNameEn,
            airportRegion,
            airportRegionEn,
          });
        });

        this.airportRepository.upsert(entities, {
          conflictPaths: ['airportCode'],
          skipUpdateIfNoValuesChanged: true,
        });
      });
    } catch (error) {
      this.logger.error('Error saving airports to DB', error);
    }
  }
}
