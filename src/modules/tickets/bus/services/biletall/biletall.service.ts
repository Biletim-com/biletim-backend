// src/biletall/biletall.service.ts

import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import axios from 'axios';

import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';

import { BiletAllParser } from './biletall.parser';

// dtos
import { BusCompanyDto } from '../../dto/bus-company.dto';
import { ScheduleListDto } from '../../dto/bus-schedule-list.dto';
import { BusSearchDto } from '../../dto/bus-search.dto';
import { BusSeatControlDto } from '../../dto/bus-seat-control.dto';
import { BoardingPointDto } from '../../dto/bus-boarding-point.dto';
import { ServiceInformationDto } from '../../dto/bus-service-information.dto';
import { BusPurchaseDto } from '../../dto/bus-purchase.dto';
import { BusRouteDto } from '../../dto/bus-route.dto';
// types
import { BusFeature } from './types/biletall-bus-feature.type';
import {
  BiletAllCompany,
  BiletAllCompanyResponse,
} from './types/biletall-company';
import {
  BiletAllStopPoint,
  BiletAllStopPointResponse,
} from './types/biletall-stop-points.type';
import {
  BusSchedule,
  BusScheduleResponse,
} from './types/biletall-trip-search.type';
import { BusResponse } from './types/biletall-bus-search.type';
import { BusSeatAvailabilityResponse } from './types/biletall-bus-seat-availability.type';
import { RouteDetailResponse } from './types/biletall-route.type';

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
    } catch (error) {
      console.error('Error running XML request:', error);
      throw new Error('Failed to process XML request');
    }
  }

  async company(requestDto: BusCompanyDto): Promise<BiletAllCompany[]> {
    const companiesXml = `<Firmalar><FirmaNo>${requestDto.companyNo}</FirmaNo></Firmalar>`;
    const res = await this.run<BiletAllCompanyResponse>(companiesXml);
    return this.biletAllParser.parseCompany(res);
  }

  async stopPoints(): Promise<BiletAllStopPoint[]> {
    const stopPointsXml = `<KaraNoktaGetirKomut/>`;
    const res = await this.run<BiletAllStopPointResponse>(stopPointsXml);
    return this.biletAllParser.parseStopPoints(res);
  }

  async scheduleList(requestDto: ScheduleListDto): Promise<{
    schedules: BusSchedule[];
    features: BusFeature[];
  }> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Sefer: {
        FirmaNo: requestDto.companyNo,
        KalkisNoktaID: requestDto.departurePointID,
        VarisNoktaID: requestDto.arrivalPointID,
        Tarih: requestDto.date,
        AraNoktaGelsin: requestDto.includeIntermediatePoints,
        IslemTipi: requestDto.operationType,
        YolcuSayisi: requestDto.passengerCount,
        Ip: requestDto.ip,
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.run<BusScheduleResponse>(xml);
    return this.biletAllParser.parseBusSchedule(res);
  }

  async busSearch(requestDto: BusSearchDto): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Otobus: {
        FirmaNo: requestDto.companyNo,
        KalkisNoktaID: requestDto.departurePointID,
        VarisNoktaID: requestDto.arrivalPointID,
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
    return this.biletAllParser.parseBusResponse(res);
  }

  async busSeatControl(requestDto: BusSeatControlDto): Promise<boolean> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      OtobusKoltukKontrol: {
        FirmaNo: requestDto.companyNo,
        KalkisNoktaID: requestDto.departurePointID,
        VarisNoktaID: requestDto.arrivalPointID,
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

  // TODO: could not get a successful response
  async boardingPoint(requestDto: BoardingPointDto): Promise<any> {
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
    return this.run(xml);
  }

  // TODO: could not get a successful response
  async serviceInformation(requestDto: ServiceInformationDto): Promise<any> {
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
    return this.run(xml);
  }

  // TODO: Add parser for this one
  async saleRequest(requestDto: BusPurchaseDto): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    let FirmaAciklama: any;
    let HatirlaticiNot: any;
    const requestDocument = {
      IslemSatis: {
        FirmaNo: requestDto.companyNo,
        KalkisNoktaID: requestDto.departurePointID,
        VarisNoktaID: requestDto.arrivalPointID,
        Tarih: new Date(requestDto.date).toISOString(),
        Saat: new Date(requestDto.time).toISOString(),
        HatNo: requestDto.routeNumber,
        SeferNo: requestDto.tripTrackingNumber,
        TelefonNo: requestDto.phoneNumber,
        ToplamBiletFiyati: requestDto.totalTicketPrice,
        YolcuSayisi: requestDto.passengers.length,
        BiletSeriNo: requestDto.ticketSeriesNo,
        OdemeSekli: requestDto.paymentType,
        FirmaAciklama,
        HatirlaticiNot,
        SeyahatTipi: requestDto.travelType,
        ...requestDto.passengers.reduce((acc, passenger, index) => {
          acc[`KoltukNo${index + 1}`] = passenger.seatNo;
          acc[`Adi${index + 1}`] = passenger.firstName;
          acc[`Soyadi${index + 1}`] = passenger.lastName;
          acc[`Cinsiyet${index + 1}`] = passenger.gender;
          acc[`TcVatandasiMi${index + 1}`] = passenger.isTurkishCitizen;
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
        WebYolcu: {
          WebUyeNo: requestDto.webPassenger.webMemberNo,
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
          ...(requestDto.webPassenger.openTicketPnrNo && {
            AcikPnrNo: requestDto.webPassenger.openTicketPnrNo,
            AcikPnrSoyad: requestDto.webPassenger.openTicketLastName,
          }),
          ...(requestDto.webPassenger.openTicketAmount && {
            AcikTutar: requestDto.webPassenger.openTicketAmount,
          }),
        },
      },
    };
    const xml = builder.buildObject(requestDocument);
    return this.run(xml);
  }

  async getRoute(requestDto: BusRouteDto): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Hat: {
        FirmaNo: requestDto.companyNo,
        HatNo: requestDto.routeNumber,
        KalkisNoktaID: requestDto.departurePointID,
        VarisNoktaID: requestDto.arrivalPointID,
        BilgiIslemAdi: requestDto.infoTechnologyName,
        SeferTakipNo: requestDto.tripTrackingNumber,
        Tarih: requestDto.date,
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.run<RouteDetailResponse>(xml);
    return this.biletAllParser.parseRouteDetail(res);
  }
}
