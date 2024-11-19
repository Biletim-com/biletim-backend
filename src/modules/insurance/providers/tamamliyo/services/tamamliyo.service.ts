import { TamamliyoApiConfigService } from '@app/configs/tamamliyo-insurance';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { Injectable } from '@nestjs/common';
import { Countries } from '../types/get-countries-type';

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
}
