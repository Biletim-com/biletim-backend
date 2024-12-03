// import { TamamliyoInsuranceTicketType } from '../helpers/insurance-ticket-type.helper';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { Injectable } from '@nestjs/common';

import { TamamliyoApiConfigService } from '@app/configs/tamamliyo-insurance';
import { InsuranceProductType, InsuranceTicketType } from '@app/common/enums';
import {
  GetPriceTravelHealthInsuranceRequestDto,
  GetPriceTravelHealthInsuranceRequestDtoInTurkish,
} from '../dto/get-price-travel-health-insurance.dto';
import {
  CreateOfferTravelHealthInsuranceRequestDto,
  CreateOfferTravelHealthInsuranceRequestDtoInTurkish,
} from '../dto/create-offer-travel-health-insurance.dto';

import { CreateOfferTravelHealthInsuranceResponse } from '../types/create-offer-travel-health-insurance.type';
import { GetPriceTravelHealthInsuranceResponse } from '../types/get-price-travel-health-insurance.type';
import {
  MakePaymentTravelHealthInsuranceRequestDto,
  MakePaymentTravelHealthInsuranceRequestDtoInTurkish,
} from '../dto/make-payment-travel-health-insurance.dto';
import { TamamliyoInsuranceProductType } from '../helpers/insurance-product-type.helper';
import { InsuranceMakePaymentResultResponse } from '../types/make-payment-response.type';

@Injectable()
export class TravelHealthInsuranceService {
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

  private getPriceTravelHealthInsuranceTranslateToTurkish = (
    requestDto: GetPriceTravelHealthInsuranceRequestDto,
  ): GetPriceTravelHealthInsuranceRequestDtoInTurkish => {
    return {
      sigortaliSayisi: requestDto.insuredPersonCount,
      baslangicTarihi: requestDto.startDate,
      bitisTarihi: requestDto.endDate,
      urun: TamamliyoInsuranceProductType[requestDto.productType],
      ulkeKodu:
        TamamliyoInsuranceProductType[requestDto.productType] ===
        TamamliyoInsuranceProductType[InsuranceProductType.ABROAD_TRAVEL]
          ? requestDto.countryCode
          : undefined,
      customerInfo: requestDto.customerInfo.map((customer) => ({
        ticketType: '1',
        // TamamliyoInsuranceTicketType[customer.ticketType].toString(),
        tcKimlikNo: customer.tcNumber,
        dogumTarihi: customer.birthDate,
        gsm_no: customer.gsmNumber,
        email: customer.email,
        ad: customer.firstName,
        soyad: customer.lastName,
      })),
    };
  };

  async getPriceTravelHealthInsurance(
    requestDto: GetPriceTravelHealthInsuranceRequestDto,
  ): Promise<GetPriceTravelHealthInsuranceResponse> {
    const requestDtoInTurkish =
      this.getPriceTravelHealthInsuranceTranslateToTurkish(requestDto);
    return this.restClientService.request<GetPriceTravelHealthInsuranceResponse>(
      {
        path: '/partner/v3/seyahat-saglik-sigortasi/fiyat-al',
        method: 'POST',
        data: requestDtoInTurkish,
        headers: this.getBasicAuthHeader(),
      },
    );
  }

  private createOfferTravelHealthInsuranceTranslateToTurkish = (
    requestDto: CreateOfferTravelHealthInsuranceRequestDto,
  ): CreateOfferTravelHealthInsuranceRequestDtoInTurkish => {
    return {
      sigortaEttiren: {
        tcKimlikNo: requestDto.policyholder.tcNumber,
        dogumTarihi: requestDto.policyholder.birthDate,
      },
      sigortali: requestDto.insuredPersons.map((customer) => ({
        tcKimlikNo: customer.tcNumber,
        dogumTarihi: customer.birthDate,
      })),
      baslangicTarihi: requestDto.startDate,
      bitisTarihi: requestDto.endDate,
      email: requestDto.email,
      gsmNo: requestDto.phoneNumber,
      urun: TamamliyoInsuranceProductType[requestDto.productType],
      ulkeKodu:
        requestDto.productType === InsuranceProductType.ABROAD_TRAVEL
          ? 998
          : undefined,
      ilKodu:
        requestDto.productType === InsuranceProductType.DOMESTIC_TRAVEL
          ? 34
          : undefined,
    };
  };

  async createOfferTravelHealthInsurance(
    requestDto: CreateOfferTravelHealthInsuranceRequestDto,
  ): Promise<CreateOfferTravelHealthInsuranceResponse> {
    const requestDtoTurkish =
      this.createOfferTravelHealthInsuranceTranslateToTurkish(requestDto);
    console.log(requestDtoTurkish);
    return this.restClientService.request<CreateOfferTravelHealthInsuranceResponse>(
      {
        path: '/partner/v3/seyahat-saglik-sigortasi/teklif-olustur',
        method: 'POST',
        data: requestDtoTurkish,
        headers: this.getBasicAuthHeader(),
      },
    );
  }

  private makePaymentTravelHealthInsuranceTranslateToTurkish = (
    requestDto: MakePaymentTravelHealthInsuranceRequestDto,
  ): MakePaymentTravelHealthInsuranceRequestDtoInTurkish => {
    return {
      parameters: {
        ticketType: '1',
        // TamamliyoInsuranceTicketType[
        //   requestDto.parameters.ticketType
        // ].toString(),
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
      ilId: 34,
      ilceId: '10',
      adres: ' KILIÇDEDE MAH. ÜLKEM SOK. NO:8A/11 İLKADIM/SAMSUN',
      donusUrl: null,
    };
  };

  async makePaymentTravelHealthInsurance(
    requestDto: MakePaymentTravelHealthInsuranceRequestDto,
  ): Promise<InsuranceMakePaymentResultResponse> {
    const requestDtoTurkish =
      this.makePaymentTravelHealthInsuranceTranslateToTurkish(requestDto);

    return await this.restClientService.request<InsuranceMakePaymentResultResponse>(
      {
        path: '/partner/v3/seyahat-saglik-sigortasi/odeme-yap',
        method: 'POST',
        data: requestDtoTurkish,
        headers: this.getBasicAuthHeader(),
      },
    );
  }
}
