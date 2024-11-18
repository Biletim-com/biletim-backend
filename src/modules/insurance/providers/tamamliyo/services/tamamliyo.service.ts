import { TamamliyoApiConfigService } from '@app/configs/tamamliyo-insurance';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { Injectable } from '@nestjs/common';
import { Countries } from '../types/get-countries-type';
import { GetCitiesResponse } from '../types/get-cities.type';
import { GetDistrictsResponse } from '../types/get-districts.type';
import { DistrictsRequestDto } from '../dto/get-districts.dto';

@Injectable()
export class TamamliyoService {
  private readonly restClientService: RestClientService;

  constructor(
    private readonly tamamliyoApiConfigService: TamamliyoApiConfigService,
  ) {
    this.restClientService = new RestClientService(
      tamamliyoApiConfigService.tamamliyoApiBaseUrl,
    );
  }

  private getBasicAuthHeader() {
    const { tamamliyoApiToken } = this.tamamliyoApiConfigService;

    return {
      'Content-Type': 'application/json',
      token: tamamliyoApiToken,
    };
  }

  async getCountries(): Promise<Countries[]> {
    return this.restClientService.request<Countries[]>({
      path: '/v1/countries',
      method: 'GET',
      headers: this.getBasicAuthHeader(),
    });
  }

  async getCities(): Promise<GetCitiesResponse> {
    return this.restClientService.request<GetCitiesResponse>({
      path: '/v1/iller',
      method: 'GET',
      data: { ulkeId: 1 },
      headers: this.getBasicAuthHeader(),
    });
  }

  async getDistricts(
    requestDto: DistrictsRequestDto,
  ): Promise<GetDistrictsResponse> {
    return this.restClientService.request<GetDistrictsResponse>({
      path: '/v1/ilceler',
      method: 'POST',
      data: { ilId: requestDto },
      headers: this.getBasicAuthHeader(),
    });
  }
}
