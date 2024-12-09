import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HotelDocument } from '../../models/hotel.schema';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { HotelApiConfigService } from '@app/configs/hotel-api/config.service';
import { HotelRepository } from '../../hotel.repository';

@Injectable()
export class HotelService {
  private readonly restClientService: RestClientService;
  constructor(
    @InjectModel(HotelDocument.name)
    private readonly hotelModel: Model<HotelDocument>,
    private readonly hotelApiConfigService: HotelApiConfigService,
    private readonly hotelRepository: HotelRepository,
  ) {
    this.restClientService = new RestClientService(
      hotelApiConfigService.hotelApiBaseUrl,
    );
  }

  get getBasicAuthHeader() {
    const { hotelApiUsername, hotelApiPassword } = this.hotelApiConfigService;

    const auth = Buffer.from(
      `${hotelApiUsername}:${hotelApiPassword}`,
    ).toString('base64');

    return {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
  }

  public toCamelCase(snakeStr: string): string {
    return snakeStr.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  public convertKeysToCamelCase(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.convertKeysToCamelCase(item));
    } else if (data !== null && typeof data === 'object') {
      return Object.keys(data).reduce((acc, key) => {
        const camelCaseKey = this.toCamelCase(key);
        acc[camelCaseKey] = this.convertKeysToCamelCase(data[key]);
        return acc;
      }, {});
    }
    return data;
  }

  async hotelDetails(id: string): Promise<any> {
    return this.restClientService.request<any>({
      path: '/hotel/info/',
      method: 'POST',
      data: { id, language: 'en' },
      headers: this.getBasicAuthHeader,
    });
  }

  async findHotelsByIds(
    ids: string[],
  ): Promise<HotelDocument | Partial<HotelDocument>[]> {
    try {
      if (ids.length === 1) {
        const hotelId = ids[0];

        let hotel = await this.hotelRepository.findOne({ _id: hotelId });

        if (hotel) {
          return hotel;
        }

        const hotelData = await this.hotelDetails(hotelId);

        if (!hotelData || !hotelData.data) {
          console.error('Hotel data is missing or invalid:', hotelData);
          throw new Error('Hotel data is missing or invalid');
        }

        const formattedHotelData = this.convertKeysToCamelCase(hotelData.data);

        hotel = await this.hotelRepository.create({
          ...formattedHotelData,
          _id: hotelData.data.id,
        });

        return hotel;
      }

      const projection = {
        address: 1,
        name: 1,
        starRating: 1,
        latitude: 1,
        longitude: 1,
        images: 1,
        descriptionStruct: 1,
      };

      return await this.hotelRepository.find({ _id: { $in: ids } }, projection);
    } catch (error: any) {
      throw new HttpException(
        `find hotels by ids  error ->  ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
