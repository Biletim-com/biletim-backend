import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AirportPoints } from '../../modules/tickets/plane/models/airport-points.entity';
import { AirportPointsRepository } from '../../modules/tickets/plane/repositories/airport-points.repository';
import { PlaneAirportDto } from '@app/modules/tickets/plane/dto/plane-airport.dto';
import { BiletallPlaneService } from '@app/modules/tickets/plane/services/biletall/biletall-plane.service';

@Injectable()
export class AirportPointsCronJobService implements OnModuleInit {
  private readonly chunkSize = 500;
  private readonly logger = new Logger(AirportPointsCronJobService.name);

  constructor(
    private biletallPlaneService: BiletallPlaneService,
    private readonly airportPointsRepository: AirportPointsRepository,
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
      const response = await this.biletallPlaneService.airportSearch();
      return this.splitIntoChunks(response);
    } catch (error) {
      this.logger.error('Error fetching airport data from BiletAll', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async saveAirportsToDb() {
    const airportDataChunks = await this.fetchAirportDataFromBiletAll();
    try {
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

          return new AirportPoints({
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

        this.airportPointsRepository.upsert(entities, {
          conflictPaths: ['airportCode'],
          skipUpdateIfNoValuesChanged: true,
        });
      });
    } catch (error) {
      this.logger.error('Error saving airports to DB', error);
    }
  }
}
