import {
  RequestConfigs,
  RestClientService,
} from '@app/providers/rest-client/provider.service';
import { Injectable } from '@nestjs/common';
import {
  GetPriceTravelHealthInsuranceRequestDtoInTurkish,
  GetPriceTravelInsuranceRequestDto,
} from './dto/get-price-travel-health-insurance.dto';
import { TamamliyoApiConfigService } from '@app/configs/tamamliyo-insurance';
import { InsuranceProductType } from '@app/common/enums/insurance-product-type.enum';
import { InsuranceTicketType } from '@app/common/enums/insurance-ticket-type.enum';
import { GetPriceResponse } from './types/get-price-travel-health-insurance-response.type';

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

  private getPriceTranslateToTurkish = (
    requestDto: GetPriceTravelInsuranceRequestDto,
  ): GetPriceTravelHealthInsuranceRequestDtoInTurkish => {
    return {
      sigortaliSayisi: requestDto.insuredPersonCount,
      baslangicTarihi: requestDto.startDate,
      bitisTarihi: requestDto.endDate,
      urun: requestDto.productType,
      ulkeKodu:
        requestDto.productType === InsuranceProductType.ABROAD_TRAVEL
          ? requestDto.countryCode
          : undefined,
      customerInfo: requestDto.customerInfo.map((customer) => ({
        ticketType: customer.ticketType === InsuranceTicketType.BUS ? '0' : '1',
        tcKimlikNo: customer.tcKimlikNo,
        dogumTarihi: customer.birthDate,
        gsm_no: customer.gsmNo,
        email: customer.email,
        ad: customer.firstName,
        soyad: customer.lastName,
      })),
    };
  };

  async getPrice(
    requestDto: GetPriceTravelInsuranceRequestDto,
  ): Promise<GetPriceResponse> {
    const url = `${this.baseUrl}/v3/seyahat-saglik-sigortasi/fiyat-al`;
    const requestDtoInTurkish = this.getPriceTranslateToTurkish(requestDto);
    console.log(requestDtoInTurkish);
    const requestConfig: RequestConfigs = {
      url,
      method: 'POST',
      data: requestDtoInTurkish,
      headers: this.getBasicAuthHeader(),
    };
    return await this.restClientService.request(requestConfig);
  }

  async getCountries(): Promise<any> {
    const url = `${this.baseUrl}/partner/v1/countries`;
    const requestConfig: RequestConfigs = {
      url,
      method: 'GET',
      headers: this.getBasicAuthHeader(),
    };
    const response = await this.restClientService.request(requestConfig);
    console.log({ response });
    return response;
  }
}
