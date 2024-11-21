import { TamamliyoApiConfigService } from '@app/configs/tamamliyo-insurance';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { Injectable } from '@nestjs/common';
import { Countries } from '../types/get-countries-type';
import {
  CreateInsuranceCancellationRequestDto,
  CreateInsuranceCancellationRequestDtoInTurkish,
  CreateInsuranceCancellationRequestResponseDto,
} from '../dto/create-insurance-cancellation-request.dto';
import { CreateInsuranceCancellationRequestResponse } from '../types/create-insurance-cancellation-request.type';

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
      path: '/partner/v1/countries',
      method: 'GET',
      headers: this.getBasicAuthHeader(),
    });
  }

  private createInsuranceCancellationRequestTranslateToTurkish = (
    requestDto: CreateInsuranceCancellationRequestDto,
  ): CreateInsuranceCancellationRequestDtoInTurkish => {
    return {
      teklif_id: requestDto.offerId,
      tc_kimlik_no: requestDto.customerTcNumber,
      musteri_adi: requestDto.customerName,
      musteri_email: requestDto.customerEmail,
      partner_email: 'info@biletim.com',
      musteri_telefon: requestDto.customerPhone,
    };
  };

  async createInsuranceCancellationRequest(
    requestDto: CreateInsuranceCancellationRequestDto,
  ): Promise<CreateInsuranceCancellationRequestResponseDto> {
    const requestDtoTurkish =
      this.createInsuranceCancellationRequestTranslateToTurkish(requestDto);
    const response =
      await this.restClientService.request<CreateInsuranceCancellationRequestResponse>(
        {
          path: '/iptal-servis/v1/iptal-talepleri/olustur',
          method: 'POST',
          data: requestDtoTurkish,
          headers: this.getBasicAuthHeader(),
        },
      );

    return new CreateInsuranceCancellationRequestResponseDto(response);
  }
}
