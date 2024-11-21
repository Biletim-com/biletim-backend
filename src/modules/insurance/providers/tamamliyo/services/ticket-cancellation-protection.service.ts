// import { TamamliyoInsuranceTicketType } from '../helpers/insurance-ticket-type.helper';
import { TamamliyoApiConfigService } from '@app/configs/tamamliyo-insurance';
import { RestClientService } from '@app/providers/rest-client/provider.service';
import { Injectable } from '@nestjs/common';
import {
  GetPriceTicketCancellationProtectionInsuranceDtoInTurkish,
  GetPriceTicketCancellationProtectionInsuranceRequestDto,
} from '../dto/get-price-ticket-cancellation-protection-insurance.dto';
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
import { InsuranceMakePaymentResultResponse } from '../types/make-payment-response.type';

@Injectable()
export class TicketCancellationProtectionInsuranceService {
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

  private getPriceTicketCancellationProtectionInsuranceTranslateToTurkish = (
    requestDto: GetPriceTicketCancellationProtectionInsuranceRequestDto,
  ): GetPriceTicketCancellationProtectionInsuranceDtoInTurkish => {
    return {
      sigortaliSayisi: requestDto.insuredPersonCount,
      parameters: {
        ticketType: 1,
        // TamamliyoInsuranceTicketType[requestDto.parameters.ticketType],
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
    const requestDtoInTurkish =
      this.getPriceTicketCancellationProtectionInsuranceTranslateToTurkish(
        requestDto,
      );
    return this.restClientService.request<GetPriceTicketCancellationProtectionInsuranceResponse>(
      {
        path: '/partner/v1/bilet-iptal-sigortasi/fiyat-al',
        method: 'POST',
        data: requestDtoInTurkish,
        headers: this.getBasicAuthHeader(),
      },
    );
  }

  private createOfferTicketCancellationProtectionInsuranceTranslateToTurkish = (
    requestDto: CreateOfferTicketCancellationProtectionInsuranceRequestDto,
  ): CreateOfferTicketCancellationProtectionInsuranceRequestDtoInTurkish => {
    return {
      sigortaEttiren: {
        tcKimlikNo: requestDto.policyholder.tcNumber,
        dogumTarihi: requestDto.policyholder.birthDate,
      },
      sigortali: requestDto.insuredPersons.map((customer) => ({
        tcKimlikNo: customer.tcNumber,
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
    const requestDtoTurkish =
      this.createOfferTicketCancellationProtectionInsuranceTranslateToTurkish(
        requestDto,
      );
    return this.restClientService.request<CreateOfferTicketCancellationProtectionInsuranceeResponse>(
      {
        path: '/partner/v1/bilet-iptal-sigortasi/teklif-olustur',
        method: 'POST',
        data: requestDtoTurkish,
        headers: this.getBasicAuthHeader(),
      },
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
      odemeTipi: '1',
      teklifId: requestDto.offerId,
      taksitSayisi: 1,
      krediKartiCvv: requestDto.creditCardCvv,
      kartNo: requestDto.creditCardNumber,
      kartSonKullanmaTarihi: requestDto.creditCardExpiryDate,
      kartSahibi: requestDto.creditCardHolder,
      ilId: 34,
      ilceId: '10',
      adres: ' KILIÇDEDE MAH. ÜLKEM SOK. NO:8A/11 İLKADIM/SAMSUN',
    };
  };

  async makePaymentTicketCancellationProtectionInsurance(
    requestDto: MakePaymentTicketCancellationProtectionInsuranceRequestDto,
  ): Promise<InsuranceMakePaymentResultResponse> {
    const requestDtoTurkish =
      this.makePaymentTicketCancellationProtectionInsuranceTranslateToTurkish(
        requestDto,
      );
    return this.restClientService.request<InsuranceMakePaymentResultResponse>({
      path: '/partner/v1/bilet-iptal-sigortasi/odeme-yap',
      method: 'POST',
      data: requestDtoTurkish,
      headers: this.getBasicAuthHeader(),
    });
  }
}
