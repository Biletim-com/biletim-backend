import { TamamliyoApiConfigService } from '@app/configs/tamamliyo-insurance';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { Injectable } from '@nestjs/common';
import { Countries } from '../types/get-countries-type';
import {
  CreateInsuranceCancellationFailureRequestResponseDto,
  CreateInsuranceCancellationRequestDto,
  CreateInsuranceCancellationRequestDtoInTurkish,
  CreateInsuranceCancellationSuccessfulRequestResponseDto,
} from '../dto/create-insurance-cancellation-request.dto';
import {
  CreateInsuranceCancellationFailureRequestResponse,
  CreateInsuranceCancellationSuccessfulRequestResponse,
} from '../types/create-insurance-cancellation-request.type';

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
  ): Promise<
    | CreateInsuranceCancellationSuccessfulRequestResponseDto
    | CreateInsuranceCancellationFailureRequestResponseDto
  > {
    const requestDtoTurkish =
      this.createInsuranceCancellationRequestTranslateToTurkish(requestDto);
    const response = await this.restClientService.request<
      | CreateInsuranceCancellationSuccessfulRequestResponse
      | CreateInsuranceCancellationFailureRequestResponse
    >({
      path: '/iptal-servis/v1/iptal-talepleri/olustur',
      method: 'POST',
      data: requestDtoTurkish,
      headers: this.getBasicAuthHeader(),
    });
    if (response.success) {
      return new CreateInsuranceCancellationSuccessfulRequestResponseDto(
        response.success,
        (
          response as CreateInsuranceCancellationSuccessfulRequestResponse
        ).message,
        (response as CreateInsuranceCancellationSuccessfulRequestResponse).data,
      );
    } else {
      return new CreateInsuranceCancellationFailureRequestResponseDto({
        success: response.success,
        data: {
          error:
            (response as CreateInsuranceCancellationFailureRequestResponse).data
              .error || 'Unknown error',
        },
      });
    }
  }
}
