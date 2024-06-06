import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SearchHotelsDto } from './dto/hotel.dto';

@Injectable()
export class HotelService {
  private readonly baseUrl: string;
  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('HOTEL_API_BASE_URL');
  }

  async getBasicAuthHeader(configService: ConfigService): Promise<any> {
    const username = configService.get<string>('HOTEL_WS_USERNAME');
    const password = configService.get<string>('HOTEL_WS_PASSWORD');
    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    return {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
  }

  async search(query: string, language: string): Promise<any> {
    const url = `${this.baseUrl}/search/multicomplete/`;
    const headers = await this.getBasicAuthHeader(this.configService);
    const body = {
      query,
      language,
    };

    try {
      const response = await axios.post(url, body, { headers });
      return response.data;
    } catch (error) {
      console.error(
        'Error making request:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to fetch data',
        error.response?.status || 500,
      );
    }
  }

  async hotelInfo(id: string, language: string): Promise<any> {
    const url = `${this.baseUrl}/hotel/info/`;
    const headers = await this.getBasicAuthHeader(this.configService);

    const body = {
      id,
      language,
    };

    try {
      const response = await axios.post(url, body, { headers });
      return response.data;
    } catch (error) {
      console.error(
        'Error making request:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to fetch data',
        error.response?.status || 500,
      );
    }
  }

  async searchHotels(searchDto: SearchHotelsDto): Promise<any> {
    const url = `${this.baseUrl}/search/serp/region/`;

    const headers = await this.getBasicAuthHeader(this.configService);

    try {
      const response = await axios.post(url, searchDto, { headers });

      const hotels = response.data.data.hotels.map((hotel) => ({
        id: hotel.id,
        rates: hotel.rates.map((rate) => ({
          match_hash: rate.match_hash,
          daily_prices: rate.daily_prices,
          meal: rate.meal,
          payment_options: rate.payment_options,
        })),
      }));
      return hotels;
    } catch (error) {
      console.error(
        'Error making request:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to fetch hotel data',
        error.response?.status || 500,
      );
    }
  }
}
