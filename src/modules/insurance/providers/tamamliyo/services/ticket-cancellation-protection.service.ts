import { TamamliyoApiConfigService } from '@app/configs/tamamliyo-insurance';
import {
  RequestConfigs,
  RestClientService,
} from '@app/providers/rest-client/provider.service';
import { Injectable } from '@nestjs/common';
import {
  GetPriceTicketCancellationProtectionInsuranceDtoInTurkish,
  GetPriceTicketCancellationProtectionInsuranceRequestDto,
} from '../dto/get-price-ticket-cancellation-protection-insurance.dto';
import { InsuranceTicketType } from '@app/common/enums';
import { GetPriceTicketCancellationProtectionInsuranceResponse } from '../types/get-price-ticket-cancellation-protection-insurance.type';
import {
  CreateOfferTicketCancellationProtectionInsuranceRequestDto,
  CreateOfferTicketCancellationProtectionInsuranceRequestDtoInTurkish,
} from '../dto/create-offer-ticket-cancellation-protection-insurance.dto';
import { CreateOfferTicketCancellationProtectionInsuranceeResponse } from '../types/create-offer-ticket-cancellation-protection-insurance.type';
import {
  MakePaymentTicketCancellationProtectionInsuranceRequestDto,
  MakePaymentTicketCancellationProtectionInsuranceRequestDtoInTurkish,
} from '../dto/make-payment-ticket-cancellation-protection-insurance.dto';

@Injectable()
export class TicketCancellationProtectionInsuranceService {
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

  private getPriceTicketCancellationProtectionInsuranceTranslateToTurkish = (
    requestDto: GetPriceTicketCancellationProtectionInsuranceRequestDto,
  ): GetPriceTicketCancellationProtectionInsuranceDtoInTurkish => {
    return {
      sigortaliSayisi: requestDto.insuredPersonCount,
      parameters: {
        ticketType:
          requestDto.parameters.ticketType === InsuranceTicketType.BUS ? 0 : 1,
        ticketPrice: requestDto.parameters.ticketPrice,
        company: requestDto.parameters.company,
        departureLocation: requestDto.parameters.departureLocation,
        ...(requestDto.parameters.departureAirport && {
          departureAirport: requestDto.parameters.departureAirport,
        }),
        arrivalLocation: requestDto.parameters.arrivalLocation,
        ...(requestDto.parameters.arrivalAirport && {
          arrivalAirport: requestDto.parameters.arrivalAirport,
        }),
        departureDate: requestDto.parameters.departureDate,
      },
    };
  };

  async getPriceTicketCancellationProtectionInsurance(
    requestDto: GetPriceTicketCancellationProtectionInsuranceRequestDto,
  ): Promise<GetPriceTicketCancellationProtectionInsuranceResponse> {
    const url = `${this.baseUrl}/v1/bilet-iptal-sigortasi/fiyat-al`;
    const requestDtoInTurkish =
      this.getPriceTicketCancellationProtectionInsuranceTranslateToTurkish(
        requestDto,
      );
    const requestConfig: RequestConfigs = {
      url,
      method: 'POST',
      data: requestDtoInTurkish,
      headers: this.getBasicAuthHeader(),
    };

    return await this.restClientService.request<GetPriceTicketCancellationProtectionInsuranceResponse>(
      requestConfig,
    );
  }

  private createOfferTicketCancellationProtectionInsuranceTranslateToTurkish = (
    requestDto: CreateOfferTicketCancellationProtectionInsuranceRequestDto,
  ): CreateOfferTicketCancellationProtectionInsuranceRequestDtoInTurkish => {
    return {
      sigortaEttiren: {
        tcKimlikNo: requestDto.policyholder.nationalIdentityNumber,
        dogumTarihi: requestDto.policyholder.birthDate,
      },
      sigortali: requestDto.insuredPersons.map((customer) => ({
        tcKimlikNo: customer.nationalIdentityNumber,
        dogumTarihi: customer.birthDate,
      })),
      email: requestDto.email,
      gsmNo: requestDto.phoneNumber,
      teklifId: requestDto.offerId,
    };
  };

  async createOfferTicketCancellationProtectionInsurance(
    requestDto: CreateOfferTicketCancellationProtectionInsuranceRequestDto,
  ): Promise<CreateOfferTicketCancellationProtectionInsuranceeResponse> {
    const url = `${this.baseUrl}/v1/bilet-iptal-sigortasi/teklif-olustur`;
    const requestDtoTurkish =
      this.createOfferTicketCancellationProtectionInsuranceTranslateToTurkish(
        requestDto,
      );
    const requestConfig: RequestConfigs = {
      url,
      method: 'POST',
      data: requestDtoTurkish,
      headers: this.getBasicAuthHeader(),
    };

    return await this.restClientService.request<CreateOfferTicketCancellationProtectionInsuranceeResponse>(
      requestConfig,
    );
  }

  private makePaymentTicketCancellationProtectionInsuranceTranslateToTurkish = (
    requestDto: MakePaymentTicketCancellationProtectionInsuranceRequestDto,
  ): MakePaymentTicketCancellationProtectionInsuranceRequestDtoInTurkish => {
    return {
      parameters: {
        pnrNo: requestDto.parameters.pnrNo,
        ...(requestDto.parameters.flightNumber && {
          flightNumber: requestDto.parameters.flightNumber,
        }),
        ticketNumber: requestDto.parameters.ticketNumber,
      },
      odemeTipi: '2',
      teklifId: requestDto.offerId,
      taksitSayisi: requestDto.installmentCount,
      krediKartiCvv: requestDto.creditCardCvv,
      krediKartiNo: requestDto.creditCardNumber,
      krediKartiBitisTarihi: requestDto.creditCardExpiryDate,
      krediKartiAd: requestDto.creditCardHolderFirstName,
      krediKartiSoyad: requestDto.creditCardHolderLastName,
      ...(requestDto.countryId && {
        ulkeKodu: requestDto.countryId,
      }),
      adres: requestDto.address,
    };
  };

  async makePaymentTicketCancellationProtectionInsurance(
    requestDto: MakePaymentTicketCancellationProtectionInsuranceRequestDto,
  ): Promise<any> {
    const url = `${this.baseUrl}/v1/bilet-iptal-sigortasi/odeme-yap`;
    const requestDtoTurkish =
      this.makePaymentTicketCancellationProtectionInsuranceTranslateToTurkish(
        requestDto,
      );
    const requestConfig: RequestConfigs = {
      url,
      method: 'POST',
      data: requestDtoTurkish,
      headers: this.getBasicAuthHeader(),
    };
    return await this.restClientService.request<any>(requestConfig);
  }
}
