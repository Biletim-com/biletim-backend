import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';

import { HotelApiConfigService } from '@app/configs/hotel-api';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { RatehawkRequestService } from './ratehawk-request.service';

import { HotelRateValidationRequestDto } from '@app/search/hotel/dto/hotel-rate-validation.dto';
import { BookingFinishRequestDto } from '../dto/hotel-booking-finish.dto';
import { OrderBookingFormRequestDto } from '../dto/hotel-order-booking-form.dto';
import { OrderBookingFinishStatusRequestDto } from '../dto/hotel-order-booking-finish-status.dto';
import { WebhookRequestDto } from '../dto/hotel-webhook.dto';
import { OrderTotalInformationRequestDto } from '../dto/hotel-order-total-information.dto';
import { CaseConversionService } from '@app/common/helpers';

// types
import { HotelRateValidationResponseData } from '../types/hotel-prebook.type';
import { HotelOrderBookingFormResponseData } from '../types/hotel-order-booking-form.type';
import { UUID } from '@app/common/types';

@Injectable()
export class RatehawkOrderBookingService {
  private readonly restClientService: RestClientService;
  private readonly caseConversionService = CaseConversionService;

  constructor(
    private readonly ratehawkRequestService: RatehawkRequestService,
    private readonly hotelApiConfigService: HotelApiConfigService,
  ) {
    this.restClientService = new RestClientService(
      hotelApiConfigService.hotelApiBaseUrl,
    );
  }

  async validateRate(requestDto: HotelRateValidationRequestDto) {
    return this.ratehawkRequestService.sendRequest<HotelRateValidationResponseData>(
      {
        path: '/hotel/prebook/',
        method: 'POST',
        data: {
          hash: requestDto.bookBash,
          price_increase_percent: requestDto.priceIncreasePercent,
        },
      },
    );
  }

  async orderBookingForm(
    clientIp: string,
    orderId: UUID,
    dto: OrderBookingFormRequestDto,
  ) {
    const requestDto = {
      partner_order_id: orderId,
      book_hash: dto.book_hash,
      language: dto.language,
      user_ip: clientIp,
    };

    const response =
      await this.ratehawkRequestService.sendRequest<HotelOrderBookingFormResponseData>(
        {
          path: '/hotel/order/booking/form/',
          method: 'POST',
          data: requestDto,
        },
      );

    const paymentTypes = response.paymentTypes.filter(
      (payment) => payment.type === 'deposit',
    );

    return { ...response, paymentTypes };
  }

  async orderBookingFinish(requestDto: BookingFinishRequestDto) {
    return this.ratehawkRequestService.sendRequest<HotelRateValidationResponseData>(
      {
        path: '/hotel/order/booking/finish/',
        method: 'POST',
        data: requestDto,
      },
    );
  }

  async orderBookingFinishStatus(
    requestDto: OrderBookingFinishStatusRequestDto,
  ) {
    const response = await this.restClientService.request<any>({
      path: '/hotel/order/booking/finish/status/',
      method: 'POST',
      data: { requestDto },
    });
    return this.caseConversionService.convertKeysToCamelCase(response.data);
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
    const response = await this.restClientService.request<any>({
      path: '/hotel/order/info/',
      method: 'POST',
      data: { requestDto },
    });
    return this.caseConversionService.convertKeysToCamelCase(response.data);
  }
}
