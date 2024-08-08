import { BiletAllService } from '../../../bus/services/biletall/biletall.service';
import { BiletallPlaneParser } from './biletall-plane.parser';
import { PlaneAirPointResponse } from './types/biletall-plane-air-points.type';
import { PlaneAirPointDto } from '../../dto/plane-air-points.dto';
import { Injectable } from '@nestjs/common';
import {
  DomesticFlightScheduleDto,
  PlaneDomesticFlightScheduleRequestDto,
} from '../../dto/plane-domestic-flight-schedule.dto';
import * as xml2js from 'xml2js';
import { DomesticFlightResponse } from './types/biletall-plane-domistic-flight-schedule.type';

@Injectable()
export class BiletallPlaneService {
  constructor(
    private readonly biletallService: BiletAllService,
    private readonly biletallPlaneParser: BiletallPlaneParser,
  ) {}

  async airPointSearch(): Promise<PlaneAirPointDto[]> {
    const airPointsXML = '<HavaNoktaGetirKomut/>';
    const res = await this.biletallService.run<PlaneAirPointResponse>(
      airPointsXML,
    );
    return this.biletallPlaneParser.parseAirPoints(res);
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
        DonusTarih: requestDto.returnDate,
        SeyahatTipi: requestDto.travelType,
        IslemTipi: requestDto.operationType,
        YetiskinSayi: requestDto.adultCount,
        CocukSayi: requestDto.childCount,
        BebekSayi: requestDto.babyCount,
        Ip: requestDto.ip,
      },
    };
    const filteredRequestDocument = {
      Sefer: Object.fromEntries(
        Object.entries(requestDocument.Sefer).filter(
          ([key, value]) => value !== undefined,
        ),
      ),
    };
    const xml = builder.buildObject(filteredRequestDocument);
    const res = await this.biletallService.run<DomesticFlightResponse>(xml);
    return this.biletallPlaneParser.parseDomesticFlightResponse(res);
  }
}
