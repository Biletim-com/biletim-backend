import { Injectable } from '@nestjs/common';
import { HotelDocument } from '../models/hotel.schema';
import { HotelRepository } from '../hotel.repository';

import { RatehawkRequestService } from './ratehawk-request.service';

// types
import { HotelStaticDataResponseData } from '../types/hotel-static-data.type';

// errors
import { ServiceError } from '@app/common/errors';

@Injectable()
export class RatehawkStaticHotelDataService {
  constructor(
    private readonly hotelRepository: HotelRepository,
    private readonly ratehawkRequestService: RatehawkRequestService,
  ) {}

  private getSingleHotelStaticData(id: string) {
    return this.ratehawkRequestService.sendRequest<HotelStaticDataResponseData>(
      {
        path: '/hotel/info/',
        method: 'POST',
        data: { id, language: 'en' },
      },
    );
  }

  async findHotelById(id: string): Promise<HotelDocument> {
    let hotel = await this.hotelRepository.findOne({ _id: id });

    if (hotel) {
      return hotel;
    }

    const hotelData = await this.getSingleHotelStaticData(id);

    if (!hotelData) {
      console.error('Hotel data is missing or invalid:', hotelData);
      throw new ServiceError('Hotel data is missing or invalid');
    }

    hotel = await this.hotelRepository.create({
      ...hotelData,
      _id: hotelData.id,
    });

    return hotel;
  }

  async findHotelsByIds(
    ids: string[],
  ): Promise<Partial<HotelDocument & { _id: string }>[]> {
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
      deleted: 1,
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

    let createdMissingHotels: Partial<HotelDocument & { _id: string }>[] = [];
    if (missingHotelIds.length > 0) {
      const newHotelsData = await Promise.all(
        missingHotelIds.map((missingHotelId) =>
          this.getSingleHotelStaticData(missingHotelId),
        ),
      );

      createdMissingHotels = await this.hotelRepository.createMany(
        newHotelsData.map((newHotelData) => {
          return {
            ...newHotelData,
            _id: newHotelData.id,
          };
        }),
        projection,
      );
    }

    return [...existingHotels, ...createdMissingHotels];
  }
}
