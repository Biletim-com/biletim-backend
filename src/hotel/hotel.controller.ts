import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import {
  HotelPageDto,
  QueryDto,
  ResultHotelsDetailsDto,
  SearchHotelsDto,
} from './dto/hotel.dto';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post('search/autocomplete')
  async search(
    @Body('query') query: string,
    @Body('language') language: string,
  ): Promise<any> {
    return this.hotelService.search(query, language);
  }

  @Post('search/features-info')
  async hotelInfo(@Body() body: any): Promise<any> {
    try {
      const id = body.id;
      const language = body.language;
      const hotelDetails = await this.hotelService.hotelInfo(id, language);
      return hotelDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('search/reservation-page-details')
  async hotelPageDetails(@Body() hotelPageDto: HotelPageDto): Promise<any> {
    try {
      const hotelDetails = await this.hotelService.hotelPageDetails(
        hotelPageDto,
      );
      return hotelDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('search/result-hotels-details')
  async resultHotelsDetails(
    @Body() resultHotelsDetails: ResultHotelsDetailsDto,
  ): Promise<any> {
    try {
      const hotelsDetails = await this.hotelService.resultHotelsDetails(
        resultHotelsDetails,
      );
      return hotelsDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('search/reservation-by-region')
  async searchHotels(
    @Body() searchHotelsDto: SearchHotelsDto,
    @Query() queryDto: QueryDto,
  ): Promise<any> {
    try {
      const hotelDetails = await this.hotelService.searchHotels(
        searchHotelsDto,
        queryDto,
      );
      return hotelDetails;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch hotel details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
