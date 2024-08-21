import { BiletAllService } from '../../../bus/services/biletall/biletall.service';
import { BiletallPlaneParser } from './biletall-plane.parser';
import { PlaneAirportResponse } from './types/biletall-plane-airport.type';
import { PlaneAirportDto } from '../../dto/plane-airport.dto';
import { Injectable } from '@nestjs/common';
import {
  DomesticFlightScheduleDto,
  PlaneDomesticFlightScheduleRequestDto,
} from '../../dto/plane-domestic-flight-schedule.dto';
import * as xml2js from 'xml2js';
import { DomesticFlightResponse } from './types/biletall-plane-domistic-flight-schedule.type';
import {
  AbroadFlightScheduleDto,
  PlaneAbroadFlightScheduleRequestDto,
} from '../../dto/plane-abroad-flight-schedule.dto';
import { AbroadFlightResponse } from './types/biletall-plane-abroad-flight-schedule.type';
import {
  PlanePullPriceFlightDto,
  PullPriceFlightRequestDto,
} from '../../dto/plane-pull-price-flight.dto';
import { PlanePullPriceResponse } from './types/biletall-plane-pull-price-flight.type';
import { PlanePassengerAgeRulesResponse } from './types/plane-biletall-company-passanger-age-rules.type';
import { PlanePassengerAgeRuleDto } from '../../dto/plane-company-passanger-age-rule.dto';

@Injectable()
export class BiletallPlaneService {
  constructor(
    private readonly biletallService: BiletAllService,
    private readonly biletallPlaneParser: BiletallPlaneParser,
  ) {}

  async airportSearch(): Promise<PlaneAirportDto[]> {
    const airportXML = '<HavaNoktaGetirKomut/>';
    const res = await this.biletallService.run<PlaneAirportResponse>(
      airportXML,
    );
    return this.biletallPlaneParser.parseAirport(res);
  }

  async domesticFlightScheduleSearch(
    requestDto: PlaneDomesticFlightScheduleRequestDto,
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
        SeyahatTipi: requestDto.travelType,
        IslemTipi: requestDto.operationType,
        YetiskinSayi: requestDto.adultCount,
        CocukSayi: requestDto.childCount,
        BebekSayi: requestDto.babyCount,
        Ip: requestDto.ip,
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.biletallService.run<DomesticFlightResponse>(xml);
    return this.biletallPlaneParser.parseDomesticFlightResponse(res);
  }

  async abroadFlightScheduleSearch(
    requestDto: PlaneAbroadFlightScheduleRequestDto,
  ): Promise<AbroadFlightScheduleDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Sefer: {
        FirmaNo: 1100,
        KalkisAdi: requestDto.departureAirport,
        VarisAdi: requestDto.arrivalAirport,
        Tarih: requestDto.departureDate,
        ...(requestDto.splitSearch === true && {
          SplitSearch: 1,
        }),
        ...(requestDto.returnDate && { DonusTarih: requestDto.returnDate }),
        ...(requestDto.splitSearchRoundTripGroup === true && {
          SplitSearchGidisDonusGrupla: 1,
        }),
        ...(requestDto.classType && {
          Sinif: requestDto.classType,
        }),
        SeyahatTipi: requestDto.travelType,
        IslemTipi: requestDto.operationType,
        YetiskinSayi: requestDto.adultCount,
        CocukSayi: requestDto.childCount,
        BebekSayi: requestDto.babyCount,
        Ip: requestDto.ip,
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.biletallService.run<AbroadFlightResponse>(xml);
    return this.biletallPlaneParser.parseAbroadFlightResponse(res);
  }

  async pullPriceOfFlight(
    requestDto: PullPriceFlightRequestDto,
  ): Promise<PlanePullPriceFlightDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      UcusFiyat: {
        FirmaNo: requestDto.companyNo,
        ...requestDto.segments.reduce((acc, segment, index) => {
          acc[`Segment${index + 1}`] = {
            Kalkis: segment.departureAirport,
            Varis: segment.arrivalAirport,
            KalkisTarih: segment.departureDate,
            VarisTarih: segment.arrivalDate,
            UcusNo: segment.flightNo,
            FirmaKod: segment.airlineCode,
            Sinif: segment.travelClass,
            DonusMu: segment.isReturnSegment ? 1 : 0,
            ...(segment.flightCode && { SeferKod: segment.flightCode }),
          };
          return acc;
        }, {}),
        YetiskinSayi: requestDto.adultCount ?? 0,
        CocukSayi: requestDto.childCount ?? 0,
        BebekSayi: requestDto.babyCount ?? 0,
        OgrenciSayi: requestDto.studentCount ?? 0,
        YasliSayi: requestDto.seniorCount ?? 0,
        AskerSayi: requestDto.militaryCount ?? 0,
        GencSayi: requestDto.youthCount ?? 0,
      },
    };

    const xml = builder.buildObject(requestDocument);
    const res = await this.biletallService.run<PlanePullPriceResponse>(xml);
    return this.biletallPlaneParser.parsePullPriceOfFlightResponse(res);
  }

  async planePassangerAgeRules(): Promise<PlanePassengerAgeRuleDto[]> {
    const xml = '<TasiyiciFirmaYolcuYasKurallar/>';
    const res = await this.biletallService.run<PlanePassengerAgeRulesResponse>(
      xml,
    );
    return this.biletallPlaneParser.parsePassangerAgeRule(res);
  }
}
