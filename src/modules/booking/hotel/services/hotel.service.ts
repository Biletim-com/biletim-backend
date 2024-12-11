import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HotelDocument } from '../models/hotel.schema';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { HotelApiConfigService } from '@app/configs/hotel-api/config.service';
import { HotelRepository } from '../hotel.repository';
import { HotelHelperService } from './hotel-helper.service';
import { HotelAllDataResponse } from '../types/hotel-all-data.type';
import { HotelErrorsResponse } from '../types/hotel-errors.type';

@Injectable()
export class HotelService {
  private readonly restClientService: RestClientService;
  constructor(
    @InjectModel(HotelDocument.name)
    private readonly hotelModel: Model<HotelDocument>,
    private readonly hotelHelperService: HotelHelperService,
    private readonly hotelApiConfigService: HotelApiConfigService,
    private readonly hotelRepository: HotelRepository,
  ) {
    this.restClientService = new RestClientService(
      hotelApiConfigService.hotelApiBaseUrl,
    );
  }

  async hotelDetails(
    id: string,
  ): Promise<HotelAllDataResponse | HotelErrorsResponse> {
    return this.restClientService.request<
      HotelAllDataResponse | HotelErrorsResponse
    >({
      path: '/hotel/info/',
      method: 'POST',
      data: { id, language: 'en' },
      headers: this.hotelHelperService.getBasicAuthHeader(),
    });
  }

  async findHotelById(id: string): Promise<HotelDocument> {
    let hotel = await this.hotelRepository.findOne({ _id: id });

    if (hotel) {
      return hotel;
    }

    const hotelData = await this.hotelDetails(id);

    if (!hotelData || !hotelData.data) {
      console.error('Hotel data is missing or invalid:', hotelData);
      throw new Error('Hotel data is missing or invalid');
    }

    const formattedHotelData = this.hotelHelperService.convertKeysToCamelCase(
      hotelData.data,
    );

    hotel = await this.hotelRepository.create({
      ...formattedHotelData,
      _id: formattedHotelData.id,
    });

    return hotel;
  }

  async findHotelsByIds(ids: string[]): Promise<Partial<HotelDocument>[]> {
    const projection: Partial<Record<keyof HotelDocument, 0 | 1>> = {
      address: 1,
      name: 1,
      starRating: 1,
      latitude: 1,
      longitude: 1,
      images: 1,
      imagesExt: 1,
      hid: 1,
      id: 1,
      isClosed: 1,
      region: 1,
      serpFilters: 1,
      amenityGroups: 1,
      kind: 1,
      descriptionStruct: 1,
    };

    const existingHotels = await this.hotelRepository.find(
      { _id: { $in: ids } },
      projection,
    );

    const existingHotelIds = existingHotels.map(
      (existingHotel) => existingHotel._id,
    );

    const missingHotelIds = ids
      .filter((hotelId) => !existingHotelIds.includes(hotelId))
      .slice(0, 30);

    let createdMissingHotels: Partial<HotelDocument>[] = [];
    if (missingHotelIds.length > 0) {
      const newHotelsData = await Promise.all(
        missingHotelIds.map((missingHotelId) =>
          this.hotelDetails(missingHotelId),
        ),
      );

      createdMissingHotels = await this.hotelRepository.createMany(
        newHotelsData.map((newHotelData) => {
          const formattedHotelData =
            this.hotelHelperService.convertKeysToCamelCase(newHotelData.data);
          return {
            ...formattedHotelData,
            _id: formattedHotelData.id,
          };
        }),
        projection,
      );
    }

    const result = [...existingHotels, ...createdMissingHotels];
    return result;
  }
}
