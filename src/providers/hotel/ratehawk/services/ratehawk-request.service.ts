import { Injectable } from '@nestjs/common';

import { HotelApiConfigService } from '@app/configs/hotel-api';
import {
  RestClientService,
  RequestConfigs,
} from '@app/providers/rest-client/provider.service';
import { CaseConversionService } from '@app/common/helpers';

// types
import {
  HotelSuccessfulResponse,
  HotelErrorResponse,
} from '../types/hotel-response.type';

// errors
import { ServiceError } from '@app/common/errors';
import { DeepConvertKeysToCamel } from '@app/common/types';

@Injectable()
export class RatehawkRequestService {
  private readonly restClientService: RestClientService;
  private readonly caseConversionService = CaseConversionService;

  constructor(private readonly hotelApiConfigService: HotelApiConfigService) {
    this.restClientService = new RestClientService(
      hotelApiConfigService.hotelApiBaseUrl,
    );
  }

  private get basicAuthHeader() {
    const { hotelApiUsername, hotelApiPassword } = this.hotelApiConfigService;

    const auth = Buffer.from(
      `${hotelApiUsername}:${hotelApiPassword}`,
    ).toString('base64');

    return {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
  }

  public async sendRequest<T>(
    requestConfigs: RequestConfigs,
  ): Promise<DeepConvertKeysToCamel<T>> {
    const response = await this.restClientService.request<
      HotelSuccessfulResponse<T> | HotelErrorResponse
    >({
      method: requestConfigs.method,
      path: requestConfigs.path,
      data: requestConfigs.data,
      headers: this.basicAuthHeader,
    });

    if (response.status === 'error') {
      throw new ServiceError(response.error || 'Something went wrong');
    }

    return this.caseConversionService.convertKeysToCamelCase(response.data);
  }
}
