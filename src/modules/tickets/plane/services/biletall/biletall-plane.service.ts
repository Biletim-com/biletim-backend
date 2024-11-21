import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

// services
import { BiletAllService } from '@app/common/services/biletall.service';
import { BiletAllPlaneParserService } from './biletall-plane-parser.service';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';

// entites
import { PlaneTicketSegment } from '../../entities/plane-ticket-segment.entity';
import { PlaneTicket } from '../../entities/plane-ticket.entity';
import { Order } from '@app/modules/orders/order.entity';

// dto
import { AbroadFlightScheduleDto } from '../../dto/plane-abroad-flight-schedule.dto';
import {
  PlanePullPriceFlightDto,
  PullPriceFlightRequestDto,
} from '../../dto/plane-pull-price-flight.dto';
import { PlanePassengerAgeRulesResponse } from './types/plane-biletall-company-passanger-age-rules.type';
import { PlanePassengerAgeRuleDto } from '../../dto/plane-company-passenger-age-rule.dto';
import { DomesticFlightScheduleDto } from '../../dto/plane-domestic-flight-schedule.dto';
import { PlaneAirportDto } from '../../dto/plane-airport.dto';
import { PlaneFlightScheduleRequestDto } from '../../dto/plane-flight-schedule.dto';
import {
  PullAbroadFlightPricePackagesRequestDto,
  PullAbroadFlightPricePackagesResponseDto,
} from '../../dto/plane-pull-abroad-flight-price-packages.dto';

// enums
import { PlaneTicketOperationType } from '@app/common/enums';

// types
import { PlanePullPriceResponse } from './types/biletall-plane-pull-price-flight.type';
import { DomesticFlightResponse } from './types/biletall-plane-domistic-flight-schedule.type';
import { AbroadFlightResponse } from './types/biletall-plane-abroad-flight-schedule.type';
import { PlaneAirportResponse } from './types/biletall-plane-airport.type';
import { PlaneTicketPurchaseResponse } from './types/biletall-plane-ticket-purchase.type';
import { PlaneTicketReservationResponse } from './types/biletall-plane-ticket-reservation.type';
import { pullAbroadFlightPricePackagesResponse } from './types/biletall-plane-pull-abroad-flight-price-packages.type';

// helpers
import { BiletAllFlightClassType } from './helpers/plane-flight-class-type.helper';
import { BiletAllPlanePassengerType } from './helpers/plane-passanger-type.helper';
import { BiletAllPlaneTicketOperationType } from './helpers/plane-ticket-operation-type.helper';
import { BiletAllPlaneTravelType } from './helpers/plane-travel-type.helper';
import { BiletAllGender } from '@app/common/helpers';

// utils
import { turkishToEnglish } from '@app/common/utils';
import { FlightTicketReservationDto } from '../../dto/plane-ticket-reservation.dto';
import { FlightTicketPurchaseDto } from '../../dto/plane-ticket-purchase.dto';

@Injectable()
export class BiletAllPlaneService extends BiletAllService {
  constructor(
    biletAllApiConfigService: BiletAllApiConfigService,
    private readonly biletAllPlaneParserService: BiletAllPlaneParserService,
  ) {
    super(biletAllApiConfigService);
  }

  async airportSearch(): Promise<PlaneAirportDto[]> {
    const airportXML = '<HavaNoktaGetirKomut/>';
    const res = await this.run<PlaneAirportResponse>(airportXML);
    return this.biletAllPlaneParserService.parseAirport(res);
  }

  async domesticFlightScheduleSearch(
    requestDto: PlaneFlightScheduleRequestDto,
  ): Promise<DomesticFlightScheduleDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Sefer: {
        FirmaNo: 1000,
        KalkisAdi: requestDto.departureAirport,
        VarisAdi: requestDto.arrivalAirport,
        Tarih: requestDto.departureDate,
        ...(requestDto.returnDate && {
          DonusTarih: requestDto.returnDate,
        }),
        SeyahatTipi: BiletAllPlaneTravelType[requestDto.travelType],
        IslemTipi: 0,
        YetiskinSayi: requestDto.adultCount,
        CocukSayi: requestDto.childCount ?? 0,
        BebekSayi: requestDto.babyCount ?? 0,
        OgrenciSayi: requestDto.studentCount ?? 0,
        YasliSayi: requestDto.olderCount ?? 0,
        AskerSayi: requestDto.militaryCount ?? 0,
        GencSayi: requestDto.youthCount ?? 0,
        Ip: '127.0.0.1',
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.run<DomesticFlightResponse>(xml);
    return this.biletAllPlaneParserService.parseDomesticFlightResponse(res);
  }

  async abroadFlightScheduleSearch(
    requestDto: PlaneFlightScheduleRequestDto,
  ): Promise<AbroadFlightScheduleDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Sefer: {
        FirmaNo: 1100,
        KalkisAdi: requestDto.departureAirport,
        VarisAdi: requestDto.arrivalAirport,
        Tarih: requestDto.departureDate,
        ...(requestDto.returnDate && { DonusTarih: requestDto.returnDate }),
        Sinif: BiletAllFlightClassType[requestDto.classType],

        SeyahatTipi: BiletAllPlaneTravelType[requestDto.travelType],
        IslemTipi: 0,
        YetiskinSayi: requestDto.adultCount,
        CocukSayi: requestDto.childCount ?? 0,
        BebekSayi: requestDto.babyCount ?? 0,
        Ip: '127.0.0.1',
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.run<AbroadFlightResponse>(xml);
    return this.biletAllPlaneParserService.parseAbroadFlightResponse(res);
  }

  async pullAbroadFlightPricePackages(
    requestDto: PullAbroadFlightPricePackagesRequestDto,
  ): Promise<PullAbroadFlightPricePackagesResponseDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      UcusFiyatPaket: {
        IslemId: requestDto.operationId,
        FirmaNo: 1100,
        ...requestDto.segments.reduce((acc, segment, index) => {
          acc[`Segment${index + 1}`] = {
            Kalkis: segment.departureAirport,
            Varis: segment.arrivalAirport,
            KalkisTarih: segment.departureDate,
            VarisTarih: segment.arrivalDate,
            UcusNo: segment.flightNumber,
            FirmaKod: segment.airlineCode,
            Sinif: segment.flightClass,
            DonusMu: segment.isReturnFlight ? 1 : 0,
            SeferKod: segment.flightCode,
          };
          return acc;
        }, {}),
        YetiskinSayi: requestDto.adultCount ?? 0,
        CocukSayi: requestDto.childCount ?? 0,
        BebekSayi: requestDto.babyCount ?? 0,
        OgrenciSayi: requestDto.studentCount ?? 0,
        YasliSayi: requestDto.elderlyCount ?? 0,
        AskerSayi: requestDto.militaryCount ?? 0,
        GencSayi: requestDto.youthCount ?? 0,
        CIP: 0,
      },
    };

    const xml = builder.buildObject(requestDocument);
    const res = await this.run<pullAbroadFlightPricePackagesResponse>(xml);
    return this.biletAllPlaneParserService.parsePullAbroadFlightPricePackagesResponse(
      res,
    );
  }

  async pullPriceOfFlight(
    requestDto: PullPriceFlightRequestDto,
  ): Promise<PlanePullPriceFlightDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      UcusFiyat: {
        FirmaNo: requestDto.companyNumber,
        ...requestDto.segments.reduce((acc, segment, index) => {
          acc[`Segment${index + 1}`] = {
            Kalkis: segment.departureAirport,
            Varis: segment.arrivalAirport,
            KalkisTarih: segment.departureDate,
            VarisTarih: segment.arrivalDate,
            UcusNo: segment.flightNumber,
            FirmaKod: segment.airlineCode,
            Sinif: segment.flightClass,
            DonusMu: segment.isReturnFlight ? 1 : 0,
            ...(segment.flightCode && { SeferKod: segment.flightCode }),
          };
          return acc;
        }, {}),
        YetiskinSayi: requestDto.adultCount ?? 0,
        CocukSayi: requestDto.childCount ?? 0,
        BebekSayi: requestDto.babyCount ?? 0,
        OgrenciSayi: requestDto.studentCount ?? 0,
        YasliSayi: requestDto.elderlyCount ?? 0,
        AskerSayi: requestDto.militaryCount ?? 0,
        GencSayi: requestDto.youthCount ?? 0,
      },
    };

    const xml = builder.buildObject(requestDocument);
    const res = await this.run<PlanePullPriceResponse>(xml);
    return this.biletAllPlaneParserService.parsePullPriceOfFlightResponse(res);
  }

  async planePassengerAgeRules(): Promise<PlanePassengerAgeRuleDto[]> {
    const xml = '<TasiyiciFirmaYolcuYasKurallar/>';
    const res = await this.run<PlanePassengerAgeRulesResponse>(xml);
    return this.biletAllPlaneParserService.parsePassengerAgeRule(res);
  }

  /**
   * plane ticket purchase or reservation
   */
  async processPlaneTicket(
    clientIp: string,
    operationType: PlaneTicketOperationType.PURCHASE,
    totalPrice: string,
    order: Order,
    planeTickets: PlaneTicket[],
    segments: PlaneTicketSegment[],
  ): Promise<FlightTicketPurchaseDto>;

  async processPlaneTicket(
    clientIp: string,
    operationType: PlaneTicketOperationType.RESERVATION,
    totalPrice: string,
    order: Order,
    planeTickets: PlaneTicket[],
    segments: PlaneTicketSegment[],
  ): Promise<FlightTicketReservationDto>;

  async processPlaneTicket(
    clientIp: string,
    operationType: PlaneTicketOperationType,
    totalPrice: string,
    order: Order,
    planeTickets: PlaneTicket[],
    segments: PlaneTicketSegment[],
  ): Promise<FlightTicketPurchaseDto | FlightTicketReservationDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      IslemUcak_2: {
        IslemTip: BiletAllPlaneTicketOperationType[operationType],
        FirmaNo: segments[0].companyNumber,
        TelefonNo: order.userPhoneNumber,
        CepTelefonNo: order.userPhoneNumber,
        Email: order.userEmail,
        HatirlaticiNot: '',
        ...segments.reduce((acc, segment, index) => {
          acc[`Segment${index + 1}`] = {
            Kalkis: segment.departureAirport,
            Varis: segment.arrivalAirport,
            KalkisTarih: segment.departureDate,
            VarisTarih: segment.arrivalDate,
            UcusNo: segment.flightNumber,
            FirmaKod: segment.airlineCode,
            Sinif: segment.flightClass,
            DonusMu: segment.isReturnFlight ? 1 : 0,
            ...(segment.flightCode && { SeferKod: segment.flightCode }),
          };
          return acc;
        }, {}),
        ...planeTickets.reduce((acc, planeTicket, index) => {
          const { passenger } = planeTicket;
          acc[`Yolcu${index + 1}`] = {
            Ad: turkishToEnglish(passenger.firstName),
            Soyad: turkishToEnglish(passenger.lastName),
            Cinsiyet: BiletAllGender[passenger.gender],
            YolcuTip: BiletAllPlanePassengerType[passenger.passengerType],
            TCKimlikNo: passenger.tcNumber,
            DogumTarih: passenger.birthday,
            ...(passenger.passportNumber && {
              PasaportNo: passenger.passportNumber,
            }),
            ...(passenger.passportCountryCode && {
              PasaportUlkeKod: passenger.passportCountryCode,
            }),
            ...(passenger.passportExpirationDate && {
              PasaportGecerlilikTarihi: passenger.passportExpirationDate,
            }),
            NetFiyat: planeTicket.netPrice,
            Vergi: planeTicket.taxAmount,
            ServisUcret: planeTicket.serviceFee,
          };
          return acc;
        }, {}),
        ...(operationType === PlaneTicketOperationType.PURCHASE && {
          WebYolcu: {
            Ip: clientIp,
            OnOdemeKullan: 1,
            OnOdemeTutar: totalPrice,
          },
        }),
      },
    };

    const xml = builder.buildObject(requestDocument);
    const res = await this.run<
      PlaneTicketPurchaseResponse | PlaneTicketReservationResponse
    >(xml);

    return operationType === PlaneTicketOperationType.PURCHASE
      ? this.biletAllPlaneParserService.parseFlightTicketPurchase(res)
      : this.biletAllPlaneParserService.parseFlightTicketReservation(res);
  }
}
