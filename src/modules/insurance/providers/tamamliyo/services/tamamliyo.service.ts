import { TamamliyoApiConfigService } from '@app/configs/tamamliyo-insurance';
import {
  RequestConfigs,
  RestClientService,
} from '@app/providers/rest-client/provider.service';
import { Injectable } from '@nestjs/common';
import { Countries } from '../types/get-countries-type';
import { GetCitiesResponse } from '../types/get-cities.type';
import { GetDistrictsResponse } from '../types/get-districts.type';
import { DistrictsRequestDto } from '../dto/get-districts.dto';

@Injectable()
export class TamamliyoService {
  private readonly baseUrl: string;
  constructor(
    private readonly restClientService: RestClientService,
    private readonly tamamliyoApiConfigService: TamamliyoApiConfigService,
  ) {
    this.baseUrl = this.tamamliyoApiConfigService.tamamliyoApiBaseUrl;
  }

  private getBasicAuthHeader() {
    const { tamamliyoApiToken } = this.tamamliyoApiConfigService;

    return {
      'Content-Type': 'application/json',
      token: tamamliyoApiToken,
    };
  }

  async getCountries(): Promise<Countries[]> {
    const url = `${this.baseUrl}/v1/countries`;
    const requestConfig: RequestConfigs = {
      url,
      method: 'GET',
      headers: this.getBasicAuthHeader(),
    };
    return await this.restClientService.request<Countries[]>(requestConfig);
  }

  async getCities(): Promise<GetCitiesResponse> {
    const url = `${this.baseUrl}/v1/iller`;
    const requestConfig: RequestConfigs = {
      url,
      method: 'GET',
      data: { ulkeId: 1 },
      headers: this.getBasicAuthHeader(),
    };
    return await this.restClientService.request<GetCitiesResponse>(
      requestConfig,
    );
  }

  async getDistricts(
    requestDto: DistrictsRequestDto,
  ): Promise<GetDistrictsResponse> {
    const url = `${this.baseUrl}/v1/ilceler`;
    const requestConfig: RequestConfigs = {
      url,
      method: 'POST',
      data: { ilId: requestDto },
      headers: this.getBasicAuthHeader(),
    };
    return await this.restClientService.request<GetDistrictsResponse>(
      requestConfig,
    );
  }
}
