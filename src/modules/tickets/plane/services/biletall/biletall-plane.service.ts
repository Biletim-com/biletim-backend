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
}
