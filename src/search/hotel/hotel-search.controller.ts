import { Controller, Query, Get } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';

// services
import { RatehawkSearchService } from '@app/providers/hotel/ratehawk/services/ratehawk-search.service';
import { RatehawkOrderBookingService } from '@app/providers/hotel/ratehawk/services/ratehawk-order-booking.service';
import { RatehawkStaticHotelDataService } from '@app/providers/hotel/ratehawk/services/ratehawk-static-hotel-data.service';

import { HotelSearchQueryDto } from './dto/hotel-search.dto';
import { HotelAvailabilityByRegionIdRequestDto } from './dto/hotel-availability-by-region-id-request.dto';
import { HotelAvailabilityByHotelIdsRequestDto } from './dto/hotel-availability-by-hotel-ids-request.dto';
import { HotelRateValidationRequestDto } from './dto/hotel-rate-validation.dto';

// dto
import { HotelPageRequestDto } from './dto/hotel-page-request.dto';
import { HotelPageResponseDto } from './dto/hotel-page-response.dto';
import { HotelDocument } from '@app/providers/hotel/ratehawk/models/hotel.schema';

@ApiTags('Hotel Search')
@ApiExtraModels(HotelAvailabilityByHotelIdsRequestDto)
@Controller('search/hotels')
export class HotelSearchController {
  constructor(
    private readonly ratehawkSearchService: RatehawkSearchService,
    private readonly ratehawkStaticHotelDataService: RatehawkStaticHotelDataService,
    private readonly ratehawkOrderBookingService: RatehawkOrderBookingService,
  ) {}

  @ApiOperation({ summary: 'Search Hotels' })
  @Get('')
  async search(@Query() { query, language }: HotelSearchQueryDto) {
    return this.ratehawkSearchService.search(query, language);
  }

  @ApiOperation({
    summary: 'Search Reservation By Hotel Id  For Just One Hotel',
  })
  @Get('/hotel-page')
  async getHotelPage(
    @Query() requestDto: HotelPageRequestDto,
  ): Promise<HotelPageResponseDto> {
    const hotelPagePromise =
      this.ratehawkSearchService.getHotelPage(requestDto);
    const hotelPageStaticDataPromise =
      this.ratehawkStaticHotelDataService.findHotelById(requestDto.id);

    const [{ hotels }, hotelPageStaticData] = await Promise.all([
      hotelPagePromise,
      hotelPageStaticDataPromise,
    ]);

    return { ...hotels[0], staticData: hotelPageStaticData };
  }

  @ApiOperation({ summary: 'Search Hotel Availability By Region Id' })
  @Get('/availability-by-region-id')
  async searchHotelAvailabilityByRegionId(
    @Query()
    requestDto: HotelAvailabilityByRegionIdRequestDto,
  ): Promise<HotelPageResponseDto[]> {
    const { hotels } =
      await this.ratehawkSearchService.searchHotelAvailabilityByRegionId(
        requestDto,
      );
    const hotelIds = hotels.map((hotel) => hotel.id);

    const hotelsStaticData =
      await this.ratehawkStaticHotelDataService.findHotelsByIds(hotelIds);
    const hotelsStaticDataMap = new Map<string, Partial<HotelDocument>>();
    hotelsStaticData.forEach((hotelStaticData) =>
      hotelsStaticDataMap.set(hotelStaticData._id as string, hotelStaticData),
    );

    return hotels.map((hotel) => ({
      ...hotel,
      staticData: hotelsStaticDataMap.get(hotel.id),
    }));
  }

  @ApiOperation({
    summary: 'Search Hotel Availability by Hotel Ids',
  })
  @Get('/availability-by-hotel-ids')
  async searchHotelAvailabilityByHotelIds(
    @Query()
    requestDto: HotelAvailabilityByHotelIdsRequestDto,
  ) {
    const hotelsPromise =
      this.ratehawkSearchService.searchHotelAvailabilityByHotelIds(requestDto);
    const hotelsStaticDataPromise =
      this.ratehawkStaticHotelDataService.findHotelsByIds(requestDto.ids);

    const [{ hotels }, hotelsStaticData] = await Promise.all([
      hotelsPromise,
      hotelsStaticDataPromise,
    ]);

    const hotelsStaticDataMap = new Map<string, Partial<HotelDocument>>();
    hotelsStaticData.forEach((hotelStaticData) =>
      hotelsStaticDataMap.set(hotelStaticData._id as string, hotelStaticData),
    );

    return hotels.map((hotel) => ({
      ...hotel,
      staticData: hotelsStaticDataMap.get(hotel.id),
    }));
  }

  @ApiOperation({
    summary: 'Availability Rate of The Selected Hotel Room',
  })
  @Get('/validate-rate')
  async validateRate(@Query() prebookDto: HotelRateValidationRequestDto) {
    return this.ratehawkOrderBookingService.validateRate(prebookDto);
  }
}
