import { Injectable } from '@nestjs/common';

// services
import { RatehawkRequestService } from './ratehawk-request.service';

// dto
import { HotelPageRequestDto } from '@app/search/hotel/dto/hotel-page-request.dto';
import { HotelAvailabilityByRegionIdRequestDto } from '@app/search/hotel/dto/hotel-availability-by-region-id-request.dto';
import { HotelAvailabilityByHotelIdsRequestDto } from '@app/search/hotel/dto/hotel-availability-by-hotel-ids-request.dto';

// types
import { HotelSearchResponseData } from '../types/hotel-search-response.type';
import { HotelsAvailabilityByHoltelIdsResponseData } from '../types/hotel-availability-by-hotel-ids-response.type';
import { HotelAvailabilityByRegionIdResponseData } from '../types/hotel-availability-by-region-id-response.type';
import { HotelPageResponseData } from '../types/hotel-page.type';
import { Language } from '@app/common/types/languages.type';

// enums
import { Currency } from '@app/common/enums';

@Injectable()
export class RatehawkSearchService {
  constructor(
    private readonly ratehawkRequestService: RatehawkRequestService,
  ) {}

  search(query: string, language?: Language) {
    return this.ratehawkRequestService.sendRequest<HotelSearchResponseData>({
      path: '/search/multicomplete/',
      method: 'POST',
      data: { query, language },
    });
  }

  searchHotelAvailabilityByHotelIds(
    requestDto: HotelAvailabilityByHotelIdsRequestDto,
  ) {
    const [checkin] = requestDto.checkin.split('T');
    const [checkout] = requestDto.checkout.split('T');
    return this.ratehawkRequestService.sendRequest<HotelsAvailabilityByHoltelIdsResponseData>(
      {
        path: '/search/serp/hotels/',
        method: 'POST',
        data: {
          ...requestDto,
          currency: Currency.TRY,
          checkin,
          checkout,
        },
      },
    );
  }

  searchHotelAvailabilityByRegionId(
    searchDto: HotelAvailabilityByRegionIdRequestDto,
  ) {
    const [checkin] = searchDto.checkin.split('T');
    const [checkout] = searchDto.checkout.split('T');

    return this.ratehawkRequestService.sendRequest<HotelAvailabilityByRegionIdResponseData>(
      {
        path: '/search/serp/region/',
        method: 'POST',
        data: {
          ...searchDto,
          currency: Currency.TRY,
          region_id: searchDto.regionId,
          checkin,
          checkout,
        },
      },
    );
  }

  getHotelPage(requestDto: HotelPageRequestDto) {
    const [checkin] = requestDto.checkin.split('T');
    const [checkout] = requestDto.checkout.split('T');
    return this.ratehawkRequestService.sendRequest<HotelPageResponseData>({
      path: '/search/hp/',
      method: 'POST',
      data: {
        ...requestDto,
        currency: Currency.TRY,
        checkin,
        checkout,
      },
    });
  }
}
