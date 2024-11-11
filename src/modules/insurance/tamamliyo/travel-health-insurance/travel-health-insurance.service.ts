import {
  RequestConfigs,
  RestClientService,
} from '@app/providers/rest-client/provider.service';
import { Injectable } from '@nestjs/common';
import {
  TravelHealthInsuranceRequestDto,
  TravelHealthInsuranceRequestDtoInTurkish,
} from './dto/travel-health-insurance.dto';
import { TamamliyoApiConfigService } from '@app/configs/tamamliyo-insurance';

@Injectable()
export class TravelHealthInsuranceService {
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

  private translateToTurkish = (
    requestDto: TravelHealthInsuranceRequestDto,
  ): TravelHealthInsuranceRequestDtoInTurkish => {
    return {
      sigortaEttiren: {
        tcKimlikNo: requestDto.providerCitizenshipNumber,
        dogumTarihi: requestDto.providerBirthDate,
      },
      sigortali: requestDto.insured.map((insured) => ({
        tcKimlikNo: insured.citizenshipNumber,
        dogumTarihi: insured.birthDate,
      })),
      baslangicTarihi: requestDto.startDate,
      bitisTarihi: requestDto.endDate,
      email: requestDto.email,
      gsmNo: requestDto.phoneNumber,
      urun: requestDto.productType,
      ulkeKodu: requestDto.countryCode,
    };
  };

  async createOffer(requestDto: TravelHealthInsuranceRequestDto): Promise<any> {
    const url = `${this.baseUrl}/v3/seyahat-saglik-sigortasi/teklif-olustur`;
    const requestDtoInTurkish = this.translateToTurkish(requestDto);
    console.log(requestDtoInTurkish.sigortali);
    const requestConfig: RequestConfigs = {
      url,
      method: 'POST',
      data: requestDtoInTurkish,
      headers: this.getBasicAuthHeader(),
    };
    console.log(requestConfig);
    const response = await this.restClientService.request(requestConfig);
    console.log({ response });
    return response;
  }
}
