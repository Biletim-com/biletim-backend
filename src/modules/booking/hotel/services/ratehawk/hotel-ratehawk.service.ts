import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

import { HotelApiConfigService } from '@app/configs/hotel-api';

import { searchReservationByRegionIdRequestDto } from '../../dto/hotel-search-reservation-by-region-id.dto';
import { SearchReservationsHotelsRequestDto } from '../../dto/hotel-search-reservations-hotels.dto';
import { SearchReservationByHotelRequestDto } from '../../dto/hotel-search-reservation-hotel.dto';
import { PrebookRequestDto } from '../../dto/hotel-prebook.dto';
import { CreditCardDataTokenizationRequestDto } from '../../dto/hotel-credit-card-data-tokenization.dto';
import { BookingFinishRequestDto } from '../../dto/hotel-booking-finish.dto';
import { OrderBookingFormRequestDto } from '../../dto/hotel-order-booking-form.dto';
import { OrderBookingFinishStatusRequestDto } from '../../dto/hotel-order-booking-finish-status.dto';
import { WebhookRequestDto } from '../../dto/hotel-webhook.dto';
import { OrderTotalInformationRequestDto } from '../../dto/hotel-order-total-information.dto';
import { HotelOrderCancelRequestDto } from '../../dto/hotel-order-cancel.dto';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { HotelService } from './hotel.service';

@Injectable()
export class RatehawkHotelService {
  private readonly restClientService: RestClientService;
  constructor(
    private readonly hotelApiConfigService: HotelApiConfigService,
    private readonly hotelService: HotelService,
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

  async search(query: string, language?: string): Promise<any> {
    const response = await this.restClientService.request<any>({
      path: '/search/multicomplete/',
      method: 'POST',
      data: { query, language },
      headers: this.getBasicAuthHeader,
    });
    return this.hotelService.convertKeysToCamelCase(response.data);
  }

  async searchReservationByRegionId(
    searchDto: searchReservationByRegionIdRequestDto,
  ): Promise<any> {
    const [checkin] = searchDto.checkin.toISOString().split('T');
    const [checkout] = searchDto.checkout.toISOString().split('T');

    try {
      const response = await this.restClientService.request<any>({
        path: '/search/serp/region/',
        method: 'POST',
        data: { ...searchDto, checkin, checkout },
        headers: this.getBasicAuthHeader,
      });

      return this.hotelService.convertKeysToCamelCase(response.data);
    } catch (error: any) {
      throw new HttpException(
        `search reservation by region id error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchReservationsHotels(
    requestDto: SearchReservationsHotelsRequestDto,
  ): Promise<any> {
    try {
      const response = await this.restClientService.request<any>({
        path: '/search/serp/hotels/',
        method: 'POST',
        data: { ...requestDto },
        headers: this.getBasicAuthHeader,
      });
      if (response.data.data?.hotels?.length === 0) {
        throw new HttpException(
          'There are no rooms available in this date range',
          HttpStatus.NOT_FOUND,
        );
      }
      return this.hotelService.convertKeysToCamelCase(response.data);
    } catch (error: any) {
      throw new HttpException(
        `search reservations by hotel ids error -> ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchReservationByHotelId(
    requestDto: SearchReservationByHotelRequestDto,
  ): Promise<any> {
    try {
      const response = await this.restClientService.request<any>({
        path: '/search/hp/',
        method: 'POST',
        data: { ...requestDto },
        headers: this.getBasicAuthHeader,
      });

      if (response.data.hotels.length === 0) {
        throw new HttpException(
          'There are no rooms available in this date range',
          HttpStatus.NOT_FOUND,
        );
      }

      return this.hotelService.convertKeysToCamelCase(response.data);
    } catch (error: any) {
      throw new HttpException(
        `search reservation by hotel id error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async prebook(requestDto: PrebookRequestDto): Promise<any> {
    try {
      const response = await this.restClientService.request<any>({
        path: '/hotel/prebook/',
        method: 'POST',
        data: { ...requestDto },
        headers: this.getBasicAuthHeader,
      });

      return this.hotelService.convertKeysToCamelCase(response.data);
    } catch (error: any) {
      throw new HttpException(
        `prebook error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async orderBookingForm(
    currency_code: string,
    dto: OrderBookingFormRequestDto,
    ip: any,
  ): Promise<any> {
    const partner_order_id: string = uuidv4();
    const requestDto = {
      partner_order_id,
      book_hash: dto.book_hash,
      language: dto.language,
      user_ip: ip,
    };

    try {
      const response = await this.restClientService.request<any>({
        path: '/hotel/order/booking/form/',
        method: 'POST',
        data: { requestDto },
        headers: this.getBasicAuthHeader,
      });
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
    dto: CreditCardDataTokenizationRequestDto,
  ): Promise<any> {
    ({ pay_uuid: dto.pay_uuid, init_uuid: dto.init_uuid } = {
      pay_uuid: uuidv4(),
      init_uuid: uuidv4(),
    });
    const url = 'https://api.payota.net/api/public/v1/manage/init_partners';
    const headers = this.getBasicAuthHeader;

    try {
      const response = await axios.post(url, dto, { headers });
      const responseData = response.config.data;

      return {
        init_uuid: responseData.init_uuid,
        pay_uuid: responseData.pay_uuid,
      };
    } catch (error: any) {
      throw new HttpException(
        `credit card data tokenization error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async orderBookingFinish(requestDto: BookingFinishRequestDto): Promise<any> {
    try {
      if (requestDto.payment_type.type === 'now') {
        if (
          !requestDto.payment_type.init_uuid ||
          !requestDto.payment_type.pay_uuid
        ) {
          throw new HttpException(
            'init_uuid and pay_uuid are required while payment_type is now',
            HttpStatus.BAD_REQUEST,
          );
        }

        requestDto.return_path = 'https://biletimapi.westerops.com';
      }

      const response = await this.restClientService.request<any>({
        path: '/hotel/order/booking/finish/',
        method: 'POST',
        data: { requestDto },
        headers: this.getBasicAuthHeader,
      });
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `order booking finish error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async orderBookingFinishStatus(
    requestDto: OrderBookingFinishStatusRequestDto,
  ): Promise<any> {
    try {
      const response = await this.restClientService.request<any>({
        path: '/hotel/order/booking/finish/status/',
        method: 'POST',
        data: { requestDto },
        headers: this.getBasicAuthHeader,
      });
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `order booking finish status  error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleWebhook(body: WebhookRequestDto): Promise<any> {
    try {
      const apiKey = this.hotelApiConfigService.hotelApiPassword;
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

  async orderInfo(requestDto: OrderTotalInformationRequestDto): Promise<any> {
    try {
      const response = await this.restClientService.request<any>({
        path: '/hotel/order/info/',
        method: 'POST',
        data: { requestDto },
        headers: this.getBasicAuthHeader,
      });
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `order info error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async orderCancellation(
    partner_order_id: HotelOrderCancelRequestDto,
  ): Promise<any> {
    try {
      const response = await this.restClientService.request<any>({
        path: '/hotel/order/cancel/',
        method: 'POST',
        data: { partner_order_id },
        headers: this.getBasicAuthHeader,
      });
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        `order cancellation error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async downloadInfoInvoice(partner_order_id: string): Promise<Buffer> {
    const headers = this.getBasicAuthHeader;
    const params = { partner_order_id };
    const jsonData = encodeURIComponent(JSON.stringify(params));
    const url = `https://api.worldota.net/api/b2b/v3/hotel/order/document/info_invoice/download/?data=${jsonData}`;

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
