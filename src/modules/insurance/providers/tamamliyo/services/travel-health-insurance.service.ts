import {
  RequestConfigs,
  RestClientService,
} from '@app/providers/rest-client/provider.service';
import { Injectable } from '@nestjs/common';

import { TamamliyoApiConfigService } from '@app/configs/tamamliyo-insurance';
import { InsuranceProductType } from '@app/common/enums/insurance-product-type.enum';
import { InsuranceTicketType } from '@app/common/enums/insurance-ticket-type.enum';
import {
  GetPriceTravelHealthInsuranceRequestDto,
  GetPriceTravelHealthInsuranceRequestDtoInTurkish,
} from '../dto/get-price-travel-health-insurance.dto';
import {
  CreateOfferTravelHealthInsuranceRequestDto,
  CreateOfferTravelHealthInsuranceRequestDtoInTurkish,
} from '../dto/create-offer-travel-health-insurance.dto';

import { CreateOfferTravelHealthInsuranceResponse } from '../types/create-offer-travel-health-insurance.type';
import { GetPriceTravelHealthInsuranceResponse } from '../types/get-price-travel-health-insurance-response.type';
import {
  MakePaymentTravelHealthInsuranceRequestDto,
  MakePaymentTravelHealthInsuranceRequestDtoInTurkish,
} from '../dto/make-payment-travel-health-insurance.dto';

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

  private getPriceTravelHealthInsuranceTranslateToTurkish = (
    requestDto: GetPriceTravelHealthInsuranceRequestDto,
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
        tcKimlikNo: customer.nationalIdentityNumber,
        dogumTarihi: customer.birthDate,
        gsm_no: customer.gsmNo,
        email: customer.email,
        ad: customer.firstName,
        soyad: customer.lastName,
      })),
    };
  };

  async getPriceTravelHealthInsurance(
    requestDto: GetPriceTravelHealthInsuranceRequestDto,
  ): Promise<GetPriceTravelHealthInsuranceResponse> {
    const url = `${this.baseUrl}/v3/seyahat-saglik-sigortasi/fiyat-al`;
    const requestDtoInTurkish =
      this.getPriceTravelHealthInsuranceTranslateToTurkish(requestDto);
    const requestConfig: RequestConfigs = {
      url,
      method: 'POST',
      data: requestDtoInTurkish,
      headers: this.getBasicAuthHeader(),
    };
    return await this.restClientService.request<GetPriceTravelHealthInsuranceResponse>(
      requestConfig,
    );
  }

  private createOfferTravelHealthInsuranceTranslateToTurkish = (
    requestDto: CreateOfferTravelHealthInsuranceRequestDto,
  ): CreateOfferTravelHealthInsuranceRequestDtoInTurkish => {
    return {
      sigortaEttiren: {
        tcKimlikNo: requestDto.policyholder.nationalIdentityNumber,
        dogumTarihi: requestDto.policyholder.birthDate,
      },
      sigortali: requestDto.insuredPersons.map((customer) => ({
        tcKimlikNo: customer.nationalIdentityNumber,
        dogumTarihi: customer.birthDate,
      })),
      baslangicTarihi: requestDto.startDate,
      bitisTarihi: requestDto.endDate,
      email: requestDto.email,
      gsmNo: requestDto.phoneNumber,
      urun: requestDto.productType,
      ulkeKodu:
        requestDto.productType === InsuranceProductType.ABROAD_TRAVEL
          ? requestDto.countryCode
          : undefined,
      ilKodu:
        requestDto.productType === InsuranceProductType.DOMESTIC_TRAVEL
          ? requestDto.cityCode
          : undefined,
    };
  };

  async createOfferTravelHealthInsurance(
    requestDto: CreateOfferTravelHealthInsuranceRequestDto,
  ): Promise<CreateOfferTravelHealthInsuranceResponse> {
    const url = `${this.baseUrl}/v3/seyahat-saglik-sigortasi/teklif-olustur`;
    const requestDtoTurkish =
      this.createOfferTravelHealthInsuranceTranslateToTurkish(requestDto);
    const requestConfig: RequestConfigs = {
      url,
      method: 'POST',
      data: requestDtoTurkish,
      headers: this.getBasicAuthHeader(),
    };
    return await this.restClientService.request<CreateOfferTravelHealthInsuranceResponse>(
      requestConfig,
    );
  }

  private makePaymentTravelHealthInsuranceTranslateToTurkish = (
    requestDto: MakePaymentTravelHealthInsuranceRequestDto,
  ): MakePaymentTravelHealthInsuranceRequestDtoInTurkish => {
    return {
      parameters: {
        ticketType:
          requestDto.parameters.ticketType === InsuranceTicketType.BUS
            ? '0'
            : '1',
        pnrNo: requestDto.parameters.pnrNo,
        ...(requestDto.parameters.flightNumber && {
          flightNumber: requestDto.parameters.flightNumber,
        }),
        company: requestDto.parameters.company,
        departureLocation: requestDto.parameters.departureLocation,
        arrivalLocation: requestDto.parameters.arrivalLocation,
        departureDateTime: requestDto.parameters.departureDateTime,
      },
      odemeTipi: '2',
      teklifId: requestDto.offerId,
      krediKartiCvv: requestDto.creditCardCvv,
      krediKartiNo: requestDto.creditCardNumber,
      krediKartiBitisTarihi: requestDto.creditCardExpiryDate,
      krediKartiAd: requestDto.creditCardHolderFirstName,
      krediKartiSoyad: requestDto.creditCardHolderLastName,
      ...(requestDto.countryId && {
        ulkeKodu: requestDto.countryId,
      }),
      adres: requestDto.address,
      donusUrl: null,
    };
  };

  async makePaymentTravelHealthInsurance(
    requestDto: MakePaymentTravelHealthInsuranceRequestDto,
  ): Promise<any> {
    const url = `${this.baseUrl}/v3/seyahat-saglik-sigortasi/odeme-yap`;
    const requestDtoTurkish =
      this.makePaymentTravelHealthInsuranceTranslateToTurkish(requestDto);
    const requestConfig: RequestConfigs = {
      url,
      method: 'POST',
      data: requestDtoTurkish,
      headers: this.getBasicAuthHeader(),
    };
    return await this.restClientService.request<any>(requestConfig);
  }
}
