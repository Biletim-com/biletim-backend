import { Injectable, HttpException, HttpStatus, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  BookingFinishDto,
  CreditCardDataTokenizationDto,
  OrderBookingFormDto,
  OrderTotalInformationDto,
  PartnerDto,
  PrebookDto,
  QueryDto,
  SearchReservationByHotelDto,
  SearchReservationsHotelsDto,
  WebhookDto,
  searchReservationByRegionIdDto,
} from './dto/hotel.dto';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

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
      return response.data.data;
    } catch (error: any) {
      throw new HttpException(
        `search autocomplete error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchReservationByRegionId(
    searchDto: searchReservationByRegionIdDto,
    queryDto: QueryDto,
  ): Promise<any> {
    const url = `${this.baseUrl}/search/serp/region/`;

    const headers = await this.getBasicAuthHeader(this.configService);

    try {
      const response = await axios.post(url, searchDto, { headers });

      let hotels = response.data.data.hotels.map((hotel) => ({
        id: hotel.id,
        minRate: Math.min(
          ...hotel.rates.map((rate) =>
            Math.min(...rate.daily_prices.map((price) => parseFloat(price))),
          ),
        ),
        rates: hotel.rates.map((rate) => ({
          match_hash: rate.match_hash,
          daily_prices: rate.daily_prices,
          meal: rate.meal,
          payment_options: rate.payment_options,
        })),
      }));

      if (queryDto.minPrice !== undefined) {
        hotels = hotels.filter((hotel) => hotel.minRate >= queryDto.minPrice);
      }

      if (queryDto.maxPrice !== undefined) {
        hotels = hotels.filter((hotel) => hotel.minRate <= queryDto.maxPrice);
      }

      if (queryDto.sortOrder) {
        hotels.sort((a, b) => {
          if (queryDto.sortOrder === 'asc') {
            return a.minRate - b.minRate;
          } else {
            return b.minRate - a.minRate;
          }
        });
      }

      return hotels;
    } catch (error: any) {
      throw new HttpException(
        `search reservation by region id error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchReservationsHotels(
    resultDto: SearchReservationsHotelsDto,
  ): Promise<any> {
    const url = `${this.baseUrl}/search/serp/hotels/`;

    const headers = await this.getBasicAuthHeader(this.configService);

    try {
      const response = await axios.post(url, resultDto, { headers });
      if (response.data.data.hotels.length === 0) {
        throw new HttpException(
          'There are no rooms available in this date range',
          HttpStatus.NOT_FOUND,
        );
      }
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `search reservations by hotel ids error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchReservationByHotelId(
    body: SearchReservationByHotelDto,
  ): Promise<any> {
    const url = `${this.baseUrl}/search/hp/`;

    const headers = await this.getBasicAuthHeader(this.configService);

    try {
      const response = await axios.post(url, body, { headers });

      if (response.data.data.hotels.length === 0) {
        throw new HttpException(
          'There are no rooms available in this date range',
          HttpStatus.NOT_FOUND,
        );
      }
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `search reservation by hotel id error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async hotelDetails(id: string, language: string): Promise<any> {
    const url = `${this.baseUrl}/hotel/info/`;
    const headers = await this.getBasicAuthHeader(this.configService);

    const body = {
      id,
      language,
    };

    try {
      const response = await axios.post(url, body, { headers });
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `search detail page of hotel error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async prebook(prebookDto: PrebookDto): Promise<any> {
    const url = `${this.baseUrl}/hotel/prebook`;
    const headers = await this.getBasicAuthHeader(this.configService);

    try {
      const response = await axios.post(url, prebookDto, { headers });
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `prebook error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async orderBookingForm(
    currency_code: string,
    dto: OrderBookingFormDto,
    ip: any,
  ): Promise<any> {
    const partner_order_id: string = uuidv4();
    const body = {
      partner_order_id,
      book_hash: dto.book_hash,
      language: dto.language,
      user_ip: ip,
    };

    const url = `${this.baseUrl}/hotel/order/booking/form/`;
    const headers = await this.getBasicAuthHeader(this.configService);

    try {
      const response = await axios.post(url, body, { headers });
      const responseData = response.data.data;
      responseData.payment_types = responseData.payment_types.filter(
        (payment) => payment.currency_code === currency_code,
      );

      return responseData;
    } catch (error: any) {
      throw new HttpException(
        `order booking form error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async creditCardDataTokenization(
    dto: CreditCardDataTokenizationDto,
  ): Promise<any> {
    ({ pay_uuid: dto.pay_uuid, init_uuid: dto.init_uuid } = {
      pay_uuid: uuidv4(),
      init_uuid: uuidv4(),
    });
    const url = 'https://api.payota.net/api/public/v1/manage/init_partners';
    const headers = await this.getBasicAuthHeader(this.configService);

    try {
      const response = await axios.post(url, dto, { headers });
      const responseJson = response.config.data;
      const responseData = JSON.parse(responseJson);

      return {
        pay_uuid: responseData.pay_uuid,
        init_uuid: responseData.init_uuid,
      };
    } catch (error: any) {
      throw new HttpException(
        `credit card data tokenization error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async orderBookingFinish(dto: BookingFinishDto): Promise<any> {
    const url = `${this.baseUrl}/hotel/order/booking/finish/`;
    const headers = await this.getBasicAuthHeader(this.configService);

    try {
      if (dto.payment_type.type === 'now') {
        if (!dto.payment_type.init_uuid || !dto.payment_type.pay_uuid) {
          throw new HttpException(
            'init_uuid and pay_uuid are required while payment_type is now',
            HttpStatus.BAD_REQUEST,
          );
        }

        dto.return_path = 'https://biletimapi.westerops.com';
      }

      const response = await axios.post(url, dto, { headers });
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `order booking finish error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async orderBookingFinishStatus(dto: PartnerDto): Promise<any> {
    const url = `${this.baseUrl}/hotel/order/booking/finish/status/`;
    const headers = await this.getBasicAuthHeader(this.configService);

    try {
      const response = await axios.post(url, dto, { headers });
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `order booking finish status  error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleWebhook(body: WebhookDto): Promise<any> {
    try {
      const apiKey = this.configService.get<string>('HOTEL_WS_PASSWORD');
      const { signature, timestamp, token } = body.signature;

      if (!apiKey || !timestamp || !token || !signature) {
        throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
      }

      const encodedToken = crypto
        .createHmac('sha256', apiKey)
        .update(`${timestamp}${token}`)
        .digest('hex');

      if (encodedToken !== signature) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      return {
        isValid: true,
        data: {
          partner_order_id: body.data.partner_order_id,
          status: body.data.status,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async orderInfo(dto: OrderTotalInformationDto): Promise<any> {
    const url = `${this.baseUrl}/hotel/order/info/`;
    const headers = await this.getBasicAuthHeader(this.configService);

    try {
      const response = await axios.post(url, dto, { headers });
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `order info error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async orderCancellation(partner_order_id: PartnerDto): Promise<any> {
    const url = `${this.baseUrl}/hotel/order/cancel/`;
    const headers = await this.getBasicAuthHeader(this.configService);

    try {
      const response = await axios.post(url, partner_order_id, { headers });
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `order cancellation error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async downloadInfoInvoice(partner_order_id: string): Promise<Buffer> {
    const headers = await this.getBasicAuthHeader(this.configService);
    const params = { partner_order_id };
    const jsonData = encodeURIComponent(JSON.stringify(params));
    const url = `${this.baseUrl}/hotel/order/document/info_invoice/download/?data=${jsonData}`;

    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: headers,
      });

      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `download info invoice error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
