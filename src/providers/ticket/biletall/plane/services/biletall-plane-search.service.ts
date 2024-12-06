import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

// services
import { BiletAllPlaneSearchParserService } from '../parsers/biletall-plane-search.parser.service';
import { BiletAllRequestService } from '../../services/biletall-request.service';

// request dto
import { PullPriceFlightRequestDto } from '@app/modules/tickets/plane/dto/plane-pull-price-flight.dto';
import { PlanePassengerAgeRulesResponse } from '../types/biletall-plane-company-passanger-age-rules.type';
import { PlaneFlightScheduleRequestDto } from '@app/modules/tickets/plane/dto/plane-flight-schedule.dto';
import { PullAbroadFlightPricePackagesRequestDto } from '@app/modules/tickets/plane/dto/plane-pull-abroad-flight-price-packages.dto';

// response dto
import { PlaneAirportDto } from '../dto/plane-airport.dto';
import { PlanePassengerAgeRuleDto } from '../dto/plane-company-passenger-age-rule.dto';
import { DomesticFlightScheduleDto } from '../dto/plane-domestic-flight-schedule.dto';
import { PullAbroadFlightPricePackagesResponseDto } from '../dto/plane-pull-abroad-flight-price-packages.dto';
import { PlanePullPriceFlightDto } from '../dto/plane-pull-price-flight.dto';

// types
import { PlanePullPriceResponse } from '../types/biletall-plane-pull-price-flight.type';
import { DomesticFlightResponse } from '../types/biletall-plane-domistic-flight-schedule.type';
import { AbroadFlightResponse } from '../types/biletall-plane-abroad-flight-schedule.type';
import { PlaneAirportResponse } from '../types/biletall-plane-airport.type';
import { pullAbroadFlightPricePackagesResponse } from '../types/biletall-plane-pull-abroad-flight-price-packages.type';

// helpers
import { BiletAllFlightClassType } from '../helpers/plane-flight-class-type.helper';
import { BiletAllPlaneTravelType } from '../helpers/plane-travel-type.helper';
import { AbroadFlightScheduleDto } from '../dto/plane-abroad-flight-schedule.dto';

@Injectable()
export class BiletAllPlaneSearchService {
  constructor(
    private readonly biletAllRequestService: BiletAllRequestService,
    private readonly biletAllPlaneSearchParserService: BiletAllPlaneSearchParserService,
  ) {}

  async getAirports(): Promise<PlaneAirportDto[]> {
    const airportXML = '<HavaNoktaGetirKomut/>';
    const res = await this.biletAllRequestService.run<PlaneAirportResponse>(
      airportXML,
    );
    return this.biletAllPlaneSearchParserService.parseAirport(res);
  }

  async getPriceOfFlight(
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
            KalkisTarih: segment.departureDateTime,
            VarisTarih: segment.arrivalDateTime,
            UcusNo: segment.flightNumber,
            FirmaKod: segment.airlineCode,
            Sinif: segment.flightClassCode,
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
    const res = await this.biletAllRequestService.run<PlanePullPriceResponse>(
      xml,
    );
    return this.biletAllPlaneSearchParserService.parsePullPriceOfFlightResponse(
      res,
    );
  }

  async getPassengerAgeRulesPerCompany(): Promise<PlanePassengerAgeRuleDto[]> {
    const xml = '<TasiyiciFirmaYolcuYasKurallar/>';
    const res =
      await this.biletAllRequestService.run<PlanePassengerAgeRulesResponse>(
        xml,
      );
    return this.biletAllPlaneSearchParserService.parsePassengerAgeRule(res);
  }

  async searchDomesticFlights(
    clientIp: string,
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
        Ip: clientIp,
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.biletAllRequestService.run<DomesticFlightResponse>(
      xml,
    );
    return this.biletAllPlaneSearchParserService.parseDomesticFlightResponse(
      res,
    );
  }

  async searchAbroadFlights(
    clientIp: string,
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
        Ip: clientIp,
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.biletAllRequestService.run<AbroadFlightResponse>(
      xml,
    );
    return this.biletAllPlaneSearchParserService.parseAbroadFlightResponse(res);
  }

  async getAbroadFlightPackages(
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
            KalkisTarih: segment.departureDateTime,
            VarisTarih: segment.arrivalDateTime,
            UcusNo: segment.flightNumber,
            FirmaKod: segment.airlineCode,
            Sinif: segment.flightClassCode,
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
    const res =
      await this.biletAllRequestService.run<pullAbroadFlightPricePackagesResponse>(
        xml,
      );
    return this.biletAllPlaneSearchParserService.parsePullAbroadFlightPricePackagesResponse(
      res,
    );
  }
}
