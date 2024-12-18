import { Injectable } from '@nestjs/common';
import { HotelDocument } from '../models/hotel.schema';
import { HotelRepository } from '../hotel.repository';

import { RatehawkRequestService } from './ratehawk-request.service';

// types
import { Language } from '@app/common/types/languages.type';
import { HotelStaticDataResponseData } from '../types/hotel-static-data.type';

// errors
import { ServiceError } from '@app/common/errors';

@Injectable()
export class RatehawkStaticHotelDataService {
  constructor(
    private readonly hotelRepository: HotelRepository,
    private readonly ratehawkRequestService: RatehawkRequestService,
  ) {}

  private getSingleHotelStaticData(id: string, language: Language) {
    return this.ratehawkRequestService.sendRequest<HotelStaticDataResponseData>(
      {
        path: '/hotel/info/',
        method: 'POST',
        data: { id, language },
      },
    );
  }

  async findHotelById(id: string, language: Language): Promise<HotelDocument> {
    let hotel = await this.hotelRepository.findOne({
      _id: `${id}_${language}`,
    });

    if (hotel) {
      return hotel;
    }

    const newHotelData = await this.getSingleHotelStaticData(id, language);

    if (!newHotelData) {
      console.error('Hotel data is missing or invalid:', newHotelData);
      throw new ServiceError('Hotel data is missing or invalid');
    }

    hotel = await this.hotelRepository.create({
      ...newHotelData,
      language,
      _id: `${newHotelData.id}_${language}`,
    });

    return hotel;
  }

  async findHotelsByIds(
    ids: string[],
    language: Language,
  ): Promise<Partial<HotelDocument>[]> {
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
      {
        _id: ids.map((id) => `${id}_${language}`),
      },
      projection,
    );

    const existingHotelIds = existingHotels.map(
      (existingHotel) => existingHotel.id,
    );

    const missingHotelIds = ids
      .filter((hotelId) => !existingHotelIds.includes(hotelId))
      .slice(0, 30);

    let createdMissingHotels: Partial<HotelDocument>[] = [];
    if (missingHotelIds.length > 0) {
      const newHotelsData = await Promise.all(
        missingHotelIds.map((missingHotelId) =>
          this.getSingleHotelStaticData(missingHotelId, language),
        ),
      );

      createdMissingHotels = await this.hotelRepository.createMany(
        newHotelsData.map((newHotelData) => {
          return {
            ...newHotelData,
            language,
            _id: `${newHotelData.id}_${language}`,
          };
        }),
        projection,
      );
    }

    return [...existingHotels, ...createdMissingHotels];
  }
}
