import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

import { HotelApiConfigService } from '@app/configs/hotel-api';

import {
  QueryDto,
  searchReservationByRegionIdRequestDto,
} from '../../dto/hotel-search-reservation-by-region-id.dto';
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

// import {
//   createReadStream,
//   createWriteStream,
//   unlinkSync,
//   readFileSync,
//   writeFileSync,
// } from 'fs';
// import * as readline from 'readline';
// import { ZstdCodec } from 'zstd-codec';
// import * as fs from 'fs';
//  const { ZstdCodec } = require('zstd-codec');

@Injectable()
export class RatehawkHotelService {
  private readonly baseUrl: string;
  constructor(private readonly hotelApiConfigService: HotelApiConfigService) {
    this.baseUrl = this.hotelApiConfigService.hotelApiBaseUrl;
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

  async search(query: string, language: string): Promise<any> {
    const url = `${this.baseUrl}/search/multicomplete/`;
    const headers = this.getBasicAuthHeader;
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
    searchDto: searchReservationByRegionIdRequestDto,
    queryDto: QueryDto,
  ): Promise<any> {
    const [checkin] = searchDto.checkin.toISOString().split('T');
    const [checkout] = searchDto.checkout.toISOString().split('T');
    const url = `${this.baseUrl}/search/serp/region/`;
    const headers = this.getBasicAuthHeader;

    try {
      const response = await axios.post(
        url,
        {
          ...searchDto,
          checkin,
          checkout,
        },
        { headers },
      );
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
    resultDto: SearchReservationsHotelsRequestDto,
  ): Promise<any> {
    const url = `${this.baseUrl}/search/serp/hotels/`;
    console.log(resultDto);
    const headers = this.getBasicAuthHeader;

    try {
      const response = await axios.post(url, resultDto, { headers });
      if (response.data.data?.hotels?.length === 0) {
        throw new HttpException(
          'There are no rooms available in this date range',
          HttpStatus.NOT_FOUND,
        );
      }
      return response.data;
    } catch (error: any) {
      console.error('Axios Error:', error.response?.data || error.message);
      throw new HttpException(
        `search reservations by hotel ids error -> ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchReservationByHotelId(
    body: SearchReservationByHotelRequestDto,
  ): Promise<any> {
    const url = `${this.baseUrl}/search/hp/`;

    const headers = this.getBasicAuthHeader;

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
    const headers = this.getBasicAuthHeader;

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

  async prebook(body: PrebookRequestDto): Promise<any> {
    const url = `${this.baseUrl}/hotel/prebook`;
    const headers = this.getBasicAuthHeader;

    try {
      const response = await axios.post(url, body, { headers });
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
    dto: OrderBookingFormRequestDto,
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
    const headers = this.getBasicAuthHeader;

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

  async orderBookingFinish(dto: BookingFinishRequestDto): Promise<any> {
    const url = `${this.baseUrl}/hotel/order/booking/finish/`;
    const headers = this.getBasicAuthHeader;

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

  async orderBookingFinishStatus(
    dto: OrderBookingFinishStatusRequestDto,
  ): Promise<any> {
    const url = `${this.baseUrl}/hotel/order/booking/finish/status/`;
    const headers = this.getBasicAuthHeader;

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

  async orderInfo(dto: OrderTotalInformationRequestDto): Promise<any> {
    const url = `${this.baseUrl}/hotel/order/info/`;
    const headers = this.getBasicAuthHeader;

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

  async orderCancellation(
    partner_order_id: HotelOrderCancelRequestDto,
  ): Promise<any> {
    const url = `${this.baseUrl}/hotel/order/cancel/`;
    const headers = this.getBasicAuthHeader;

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
    const headers = this.getBasicAuthHeader;
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

  // async allHotels(inventory: string, language: string): Promise<void> {
  //   const body = { inventory, language };
  //   const url = `${this.baseUrl}/hotel/info/incremental_dump/`;

  //   console.log('Request Body:', body);
  //   console.log('Request URL:', url);

  //   try {
  //     const headers = await this.getBasicAuthHeader(this.configService);
  //     console.log('Request Headers:', headers);

  //     const response = await axios.post(url, body, { headers });
  //     console.log('Response Data:', response.data);

  //     const fileUrl: string = response.data.data.url;
  //     console.log("Dosya URL'si:", fileUrl);

  //     const responseStream = await axios({
  //       method: 'get',
  //       url: fileUrl,
  //       responseType: 'stream',
  //     });

  //     const tempFilePath = '/tmp/downloaded.zst';
  //     const tempFileStream = createWriteStream(tempFilePath);
  //     console.log('Temp File Path:', tempFilePath);

  //     await new Promise((resolve, reject) => {
  //       responseStream.data.pipe(tempFileStream);
  //       responseStream.data.on('end', resolve);
  //       responseStream.data.on('error', reject);
  //     });
  //     console.log('File downloaded and saved to temp file path');

  //     ZstdCodec.run((zstd) => {
  //       const simple = new zstd.Simple();
  //       const compressedData = readFileSync(tempFilePath);
  //       const decompressedData = simple.decompress(
  //         new Uint8Array(compressedData),
  //       );

  //       const decompressedFilePath = '/tmp/decompressed.json';
  //       writeFileSync(decompressedFilePath, decompressedData);
  //       console.log('Decompressed File Path:', decompressedFilePath);

  //       const rl = readline.createInterface({
  //         input: createReadStream(decompressedFilePath),
  //         crlfDelay: Infinity,
  //       });

  //       rl.on('line', (line) => {
  //         try {
  //           const parsedLine = JSON.parse(line);
  //           if (parsedLine.hotels && Array.isArray(parsedLine.hotels)) {
  //             parsedLine.hotels.forEach((hotel) => {
  //               console.log('Hotel Name:', hotel.name);
  //             });
  //           }
  //         } catch (error) {
  //           console.error('Error parsing line:', error);
  //         }
  //       });

  //       rl.on('close', () => {
  //         console.log('Finished processing the file.');

  //         unlinkSync(decompressedFilePath);
  //         console.log('Temporary file deleted.');
  //       });
  //     });
  //   } catch (error) {
  //     console.error('Error occurred:', error);
  //     throw new HttpException(
  //       'Failed to fetch data',
  //       error.response?.status || 500,
  //     );
  //   }
  // }
}
