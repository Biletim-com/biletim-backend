import {
  RequestConfigs,
  RestClientService,
} from '@app/providers/rest-client/provider.service';
import { Injectable } from '@nestjs/common';
import {
  TravelHealthInsuranceRequestDto,
  TravelHealthInsuranceRequestDtoInTurkish,
} from './dto/travel-health-insurance.dto';

@Injectable()
export class TravelHealthInsuranceService {
  constructor(private readonly restClientService: RestClientService) {}

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
    const url =
      'https://api.tamamliyo.com/partner/v3/seyahat-saglik-sigortasi/teklif-olustur';
    const requestDtoInTurkish = this.translateToTurkish(requestDto);
    console.log(requestDtoInTurkish.sigortali);
    const requestConfig: RequestConfigs = {
      url,
      method: 'POST',
      data: requestDtoInTurkish,
      headers: {
        'Content-Type': 'application/json',
        token: 'b1bd655bcd0b061c32b2e8072f298769',
      },
    };
    console.log(requestConfig);
    const response = await this.restClientService.request(requestConfig);
    console.log({ response });
    return response;
  }
}
