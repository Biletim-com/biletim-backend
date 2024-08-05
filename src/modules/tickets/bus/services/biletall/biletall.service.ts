// src/biletall/biletall.service.ts

import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import axios from 'axios';

import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';

import { BiletAllParser } from './biletall.parser';

// dtos
import { BusCompanyDto, BusCompanyRequestDto } from '../../dto/bus-company.dto';
import {
  BusScheduleAndBusFeaturesDto,
  BusScheduleRequestDto,
} from '../../dto/bus-schedule-list.dto';
import { BusSearchDto, BusSearchRequestDto } from '../../dto/bus-search.dto';
import {
  BoardingPointDto,
  BoardingPointRequestDto,
} from '../../dto/bus-boarding-point.dto';
import {
  ServiceInformationDto,
  ServiceInformationRequestDto,
} from '../../dto/bus-service-information.dto';
import { BusPurchaseDto } from '../../dto/bus-purchase.dto';
import { BusRouteDetailDto, BusRouteRequestDto } from '../../dto/bus-route.dto';

// types
import { BiletAllCompanyResponse } from './types/biletall-company.type';
import {
  BiletAllStopPoint,
  BiletAllStopPointResponse,
} from './types/biletall-stop-points.type';
import { BusScheduleAndFeaturesResponse } from './types/biletall-trip-search.type';
import { BusResponse } from './types/biletall-bus-search.type';
import { BusSeatAvailabilityResponse } from './types/biletall-bus-seat-availability.type';
import { RouteDetailResponse } from './types/biletall-route.type';
import { ServiceInformationResponse } from './types/biletall-service-information.type';
import { BoardingPointResponse } from './types/biletall-boarding-point.type';

// enums
import { Gender } from '@app/common/enums/bus-seat-gender.enum';
import {
  BusSeatAvailabilityDto,
  BusSeatAvailabilityRequestDto,
} from '../../dto/bus-seat-availability.dto';

@Injectable()
export class BiletAllService {
  constructor(
    private biletAllApiConfigService: BiletAllApiConfigService,
    private biletAllParser: BiletAllParser,
  ) {}

  private async run<T>(bodyXml: string): Promise<T> {
    const soapEnvelope = `
    <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/">
        <soap:Body>
          <tns:XmlIslet>
            <tns:xmlIslem>
              ${bodyXml}
            </tns:xmlIslem>
            <tns:xmlYetki>
              <Kullanici>
                <Adi>${this.biletAllApiConfigService.biletAllApiUsername}</Adi>
                <Sifre>${this.biletAllApiConfigService.biletAllApiPassword}</Sifre>
              </Kullanici>
            </tns:xmlYetki>
          </tns:XmlIslet>
        </soap:Body>
      </soap:Envelope>`;
    const config = {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
    };

    try {
      const response = await axios.post(
        this.biletAllApiConfigService.biletAllApiBaseUrl,
        soapEnvelope.trim(),
        config,
      );
      return xml2js.parseStringPromise(response.data) as T;
      // const resp =
      //   '<NewDataSet><Table> <Saat>2018-12-10T02:30:00+03:00</Saat></Table> <Table><Yer /><Saat>2018-12-10T02:30:00+03:00</Saat> <Internette_Gozuksunmu>0</Internette_Gozuksunmu></Table><Table><Yer> BELSİN GİRİŞ </Yer> <Saat>2018-12-10T02:30:00+03:00</Saat> <Internette_Gozuksunmu>1</Internette_Gozuksunmu></Table> <Table><Yer> FUZULİ</Yer> <Saat>2018-12-10T02:30:00+03:00</Saat> <Internette_Gozuksunmu>1</Internette_Gozuksunmu></Table> <Table><Yer> HIMMETD SHEL</Yer> <Saat>2018-12-10T02:30:00+03:00</Saat> <Internette_Gozuksunmu>1</Internette_Gozuksunmu></Table> <Table><Yer> TOYOTA</Yer> <Saat>2018-12-10T02:30:00+03:00</Saat> <Internette_Gozuksunmu>1</Internette_Gozuksunmu></Table> <Table><Yer>AĞAÇ İŞLERİ</Yer> <Saat>2018-12-10T02:40:00+03:00</Saat> <Internette_Gozuksunmu>1</Internette_Gozuksunmu></Table> </NewDataSet>';
      // const testResp = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><XmlIsletResponse xmlns="http://tempuri.org/"><XmlIsletResult>${resp}</XmlIsletResult></XmlIsletResponse></soap:Body></soap:Envelope>`;
      // return xml2js.parseStringPromise(testResp) as T;
    } catch (error) {
      console.error('Error running XML request:', error);
      throw new Error('Failed to process XML request');
    }
  }

  async company(requestDto: BusCompanyRequestDto): Promise<BusCompanyDto[]> {
    const companiesXml = `<Firmalar><FirmaNo>${requestDto.companyNo}</FirmaNo></Firmalar>`;
    const res = await this.run<BiletAllCompanyResponse>(companiesXml);
    return this.biletAllParser.parseCompany(res);
  }

  async stopPoints(): Promise<BiletAllStopPoint[]> {
    const stopPointsXml = `<KaraNoktaGetirKomut/>`;
    const res = await this.run<BiletAllStopPointResponse>(stopPointsXml);
    return this.biletAllParser.parseStopPoints(res);
  }

  async scheduleList(
    requestDto: BusScheduleRequestDto,
  ): Promise<BusScheduleAndBusFeaturesDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Sefer: {
        FirmaNo: requestDto.companyNo,
        KalkisNoktaID: requestDto.departurePointId,
        VarisNoktaID: requestDto.arrivalPointId,
        Tarih: requestDto.date,
        AraNoktaGelsin: requestDto.includeIntermediatePoints,
        IslemTipi: requestDto.operationType,
        YolcuSayisi: requestDto.passengerCount,
        Ip: requestDto.ip,
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.run<BusScheduleAndFeaturesResponse>(xml);
    return this.biletAllParser.parseBusSchedule(res);
  }

  async busSearch(requestDto: BusSearchRequestDto): Promise<BusSearchDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Otobus: {
        FirmaNo: requestDto.companyNo,
        KalkisNoktaID: requestDto.departurePointId,
        VarisNoktaID: requestDto.arrivalPointId,
        Tarih: requestDto.date,
        Saat: requestDto.time,
        HatNo: requestDto.routeNumber,
        IslemTipi: requestDto.operationType,
        YolcuSayisi: requestDto.passengerCount,
        SeferTakipNo: requestDto.tripTrackingNumber,
        Ip: requestDto.ip,
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.run<BusResponse>(xml);
    return this.biletAllParser.parseBusSearchResponse(res);
  }

  async busSeatAvailability(
    requestDto: BusSeatAvailabilityRequestDto,
  ): Promise<BusSeatAvailabilityDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      OtobusKoltukKontrol: {
        FirmaNo: requestDto.companyNo,
        KalkisNoktaID: requestDto.departurePointId,
        VarisNoktaID: requestDto.arrivalPointId,
        Tarih: requestDto.date,
        Saat: requestDto.time,
        HatNo: requestDto.routeNumber,
        IslemTipi: requestDto.operationType,
        SeferTakipNo: requestDto.tripTrackingNumber,
        Ip: requestDto.ip,
        Koltuklar: {
          Koltuk: requestDto.seats.map((seat) => ({
            KoltukNo: seat.seatNumber,
            Cinsiyet: seat.gender,
          })),
        },
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.run<BusSeatAvailabilityResponse>(xml);
    return this.biletAllParser.parseBusSeatAvailability(res);
  }

  async boardingPoint(
    requestDto: BoardingPointRequestDto,
  ): Promise<BoardingPointDto[]> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      BinecegiYer: {
        FirmaNo: requestDto.companyNo,
        KalkisNoktaID: requestDto.departurePointID,
        YerelSaat: requestDto.localTime,
        HatNo: requestDto.routeNumber,
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.run<BoardingPointResponse>(xml);
    return this.biletAllParser.parseBoardingPoint(res);
  }

  async serviceInformation(
    requestDto: ServiceInformationRequestDto,
  ): Promise<ServiceInformationDto[]> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Servis_2: {
        FirmaNo: requestDto.companyNo,
        KalkisNoktaID: requestDto.departurePointID,
        YerelSaat: requestDto.localTime,
        HatNo: requestDto.routeNumber,
        Tarih: new Date(requestDto.date).toISOString(),
        Saat: new Date(requestDto.time).toISOString(),
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.run<ServiceInformationResponse>(xml);
    return this.biletAllParser.parseServiceInformation(res);
  }

  async getRoute(requestDto: BusRouteRequestDto): Promise<BusRouteDetailDto[]> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Hat: {
        FirmaNo: requestDto.companyNo,
        HatNo: requestDto.routeNumber,
        KalkisNoktaID: requestDto.departurePointId,
        VarisNoktaID: requestDto.arrivalPointId,
        BilgiIslemAdi: requestDto.infoTechnologyName,
        SeferTakipNo: requestDto.tripTrackingNumber,
        Tarih: requestDto.date,
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.run<RouteDetailResponse>(xml);
    return this.biletAllParser.parseRouteDetail(res);
  }

  async saleRequest(requestDto: BusPurchaseDto): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });

    const {
      companyNo,
      departurePointId,
      arrivalPointId,
      date,
      time,
      routeNumber,
      passengers,
      tripTrackingNumber,
      webPassenger: { ip },
    } = requestDto;

    const passengerCount = passengers.length.toString();

    const { paymentRules } = await this.busSearch({
      companyNo,
      departurePointId,
      arrivalPointId,
      date,
      time,
      routeNumber,
      operationType: 0,
      passengerCount,
      tripTrackingNumber,
      ip,
    });

    const requestDocument = {
      IslemSatis: {
        FirmaNo: companyNo,
        KalkisNoktaID: departurePointId,
        VarisNoktaID: arrivalPointId,
        // Tarih: requestDto.date.toISOString(),
        Tarih: '2024-08-06',
        // Saat: requestDto.time.toISOString(),
        Saat: '1900-01-01T02:30:00+02:00',
        HatNo: requestDto.routeNumber,
        SeferNo: requestDto.tripTrackingNumber,
        KalkisTerminalAdiSaatleri: '',
        ...requestDto.passengers.reduce((acc, passenger, index) => {
          acc[`KoltukNo${index + 1}`] = passenger.seatNo;
          acc[`Adi${index + 1}`] = passenger.firstName;
          acc[`Soyadi${index + 1}`] = passenger.lastName;
          acc[`Cinsiyet${index + 1}`] = Gender[passenger.gender];
          acc[`TcVatandasiMi${index + 1}`] = passenger.isTurkishCitizen ? 1 : 0;
          acc[`TcKimlikNo${index + 1}`] = passenger.turkishIdNumber;
          acc[`PasaportUlkeKod${index + 1}`] = passenger.passportCountryCode;
          acc[`PasaportNo${index + 1}`] = passenger.passportNumber;
          if (passenger.boardingLocation)
            acc[`BinecegiYer${index + 1}`] = passenger.boardingLocation;
          if (passenger.departureServiceLocation)
            acc[`ServisYeriKalkis${index + 1}`] =
              passenger.departureServiceLocation;
          if (passenger.arrivalServiceLocation)
            acc[`ServisYeriVaris${index + 1}`] =
              passenger.arrivalServiceLocation;
          return acc;
        }, {}),
        TelefonNo: requestDto.phoneNumber,
        ToplamBiletFiyati: requestDto.totalTicketPrice,
        YolcuSayisi: requestDto.passengers.length,
        BiletSeriNo: 1,
        OdemeSekli: 0,
        FirmaAciklama: undefined,
        HatirlaticiNot: undefined,
        SeyahatTipi: 0,
        WebYolcu: {
          WebUyeNo: 0,
          Ip: requestDto.webPassenger.ip,
          Email: requestDto.webPassenger.email,
          ...(requestDto.webPassenger.creditCardNo && {
            KrediKartNo: requestDto.webPassenger.creditCardNo,
            KrediKartSahip: requestDto.webPassenger.creditCardHolder,
            KrediKartGecerlilikTarihi:
              requestDto.webPassenger.creditCardExpiryDate,
            KrediKartCCV2: requestDto.webPassenger.creditCardCCV2,
          }),
          ...(requestDto.webPassenger.prepaymentUsage && {
            OnOdemeKullan: requestDto.webPassenger.prepaymentUsage,
            OnOdemeTutar: requestDto.webPassenger.prepaymentAmount,
          }),
        },
      },
    };

    const xml = builder.buildObject(requestDocument);
    return xml;
    // return this.run(xml);
  }
}
