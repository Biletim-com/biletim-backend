import { Controller, Query, Get, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// services
import { RatehawkSearchService } from '@app/providers/hotel/ratehawk/services/ratehawk-search.service';
import { RatehawkOrderBookingService } from '@app/providers/hotel/ratehawk/services/ratehawk-order-booking.service';
import { RatehawkStaticHotelDataService } from '@app/providers/hotel/ratehawk/services/ratehawk-static-hotel-data.service';

import { HotelBookingOrdersRepository } from '@app/modules/orders/hotel-booking/hotel-booking-orders.repository';
import { HotelDocument } from '@app/providers/hotel/ratehawk/models/hotel.schema';

// dto
import { HotelPageRequestDto } from './dto/hotel-page-request.dto';
import { HotelPageResponseDto } from './dto/hotel-page-response.dto';
import { HotelRateValidationRequestDto } from './dto/hotel-rate-validation.dto';
import { HotelSearchQueryDto } from './dto/hotel-search.dto';
import { HotelAvailabilityByRegionIdRequestDto } from './dto/hotel-availability-by-region-id-request.dto';
import { HotelAvailabilityByHotelIdsRequestDto } from './dto/hotel-availability-by-hotel-ids-request.dto';
import {
  HotelBookingOrderStatusRequestDto,
  HotelBookingOrderStatusResponseDto,
} from './dto/hotel-booking-order-status.dto';
import { HotelReviewsDocument } from '@app/providers/hotel/ratehawk/models/hotel-reviews.schema';

@ApiTags('Hotel Search')
@Controller('search/hotels')
export class HotelSearchController {
  constructor(
    private readonly ratehawkSearchService: RatehawkSearchService,
    private readonly ratehawkStaticHotelDataService: RatehawkStaticHotelDataService,
    private readonly ratehawkOrderBookingService: RatehawkOrderBookingService,
    private readonly hotelBookingOrdersRepository: HotelBookingOrdersRepository,
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
      this.ratehawkStaticHotelDataService.findHotelById(
        requestDto.id,
        requestDto.language,
      );
    const hotelReviewsDataPromise =
      this.ratehawkStaticHotelDataService.findHotelReviewsByIds([
        requestDto.id,
      ]);

    const [{ hotels }, hotelPageStaticData, [hotelReviewsData]] =
      await Promise.all([
        hotelPagePromise,
        hotelPageStaticDataPromise,
        hotelReviewsDataPromise,
      ]);

    return {
      ...hotels[0],
      staticData: hotelPageStaticData,
      reviews: hotelReviewsData,
    };
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

    const hotelsStaticDataMap = new Map<string, Partial<HotelDocument>>();
    const hotelsReviewsDataMap = new Map<string, HotelReviewsDocument>();

    const hotelsStaticDataPromise =
      this.ratehawkStaticHotelDataService.findHotelsByIds(
        hotelIds,
        requestDto.language,
      );
    const hotelsReviewsDataPromise =
      this.ratehawkStaticHotelDataService.findHotelReviewsByIds(hotelIds);

    const [hotelsStaticData, hotelsReviewsData] = await Promise.all([
      hotelsStaticDataPromise,
      hotelsReviewsDataPromise,
    ]);

    hotelsStaticData.forEach((hotelStaticData) =>
      hotelsStaticDataMap.set(hotelStaticData.id as string, hotelStaticData),
    );
    hotelsReviewsData.forEach((hotelReviewsData) =>
      hotelsReviewsDataMap.set(hotelReviewsData.id, hotelReviewsData),
    );

    return hotels.map((hotel) => ({
      ...hotel,
      staticData: hotelsStaticDataMap.get(hotel.id),
      reviews: hotelsReviewsDataMap.get(hotel.id),
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
    const hotelsStaticDataMap = new Map<string, Partial<HotelDocument>>();
    const hotelsReviewsDataMap = new Map<string, HotelReviewsDocument>();

    const hotelsPromise =
      this.ratehawkSearchService.searchHotelAvailabilityByHotelIds(requestDto);
    const hotelsStaticDataPromise =
      this.ratehawkStaticHotelDataService.findHotelsByIds(
        requestDto.ids,
        requestDto.language,
      );
    const hotelsReviewsDataPromise =
      await this.ratehawkStaticHotelDataService.findHotelReviewsByIds(
        requestDto.ids,
      );

    const [{ hotels }, hotelsStaticData, hotelsReviewsData] = await Promise.all(
      [hotelsPromise, hotelsStaticDataPromise, hotelsReviewsDataPromise],
    );

    hotelsStaticData.forEach((hotelStaticData) =>
      hotelsStaticDataMap.set(hotelStaticData.id as string, hotelStaticData),
    );
    hotelsReviewsData.forEach((hotelReviewsData) =>
      hotelsReviewsDataMap.set(hotelReviewsData.id, hotelReviewsData),
    );

    return hotels.map((hotel) => ({
      ...hotel,
      staticData: hotelsStaticDataMap.get(hotel.id),
      reviews: hotelsReviewsDataMap.get(hotel.id),
    }));
  }

  @ApiOperation({
    summary: 'Availability Rate of The Selected Hotel Room',
  })
  @Get('/validate-rate')
  async validateRate(@Query() prebookDto: HotelRateValidationRequestDto) {
    return this.ratehawkOrderBookingService.validateRate(prebookDto);
  }

  @ApiOperation({
    summary: 'Status of the order',
  })
  @Get('/order-status')
  async orderStatus(
    @Query() { reservationNumber }: HotelBookingOrderStatusRequestDto,
  ): Promise<HotelBookingOrderStatusResponseDto> {
    const order = await this.hotelBookingOrdersRepository.findOneBy({
      reservationNumber: Number(reservationNumber),
    });
    if (!order) {
      throw new NotFoundException('Order does not exist');
    }
    return { status: order.status };
  }
}
