import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import * as dayjs from 'dayjs';

import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';

import { BiletAllBusParserService } from './biletall-bus-parser.service';

// dtos
import { BusCompanyDto, BusCompanyRequestDto } from '../../dto/bus-company.dto';
import {
  BusScheduleListResponseDto,
  BusScheduleRequestDto,
} from '../../dto/bus-schedule-list.dto';
import {
  BusTicketDetailDto,
  BusTicketDetailRequestDto,
} from '../../dto/bus-ticket-detail.dto';
import {
  BoardingPointDto,
  BoardingPointRequestDto,
} from '../../dto/bus-boarding-point.dto';
import {
  ServiceInformationDto,
  ServiceInformationRequestDto,
} from '../../dto/bus-service-information.dto';
import { BusTicketPurchaseDto } from '@app/common/dtos/bus-ticket-purchase.dto';
import { BusRouteDetailDto } from '../../dto/bus-route.dto';
import { BusTerminalDto } from '../../dto/bus-terminal.dto';

// types
import { BiletAllCompanyResponse } from './types/biletall-company.type';
import { BusStopPointResponse } from './types/biletall-bus-terminal.type';
import { BusScheduleAndFeaturesResponse } from './types/biletall-trip-search.type';
import { BusResponse } from './types/biletall-bus-search.type';
import { RouteDetailResponse } from './types/biletall-route.type';
import { ServiceInformationResponse } from './types/biletall-service-information.type';
import { BoardingPointResponse } from './types/biletall-boarding-point.type';

// helpers
import { BiletAllGender } from '@app/common/helpers';
import { BiletAllService } from '@app/common/services/biletall.service';
import {
  BusSeatAvailabilityDto,
  BusSeatAvailabilityRequestDto,
} from '../../dto/bus-seat-availability.dto';
import { BusSeatAvailabilityResponse } from './types/biletall-bus-seat-availability.type';

@Injectable()
export class BiletAllBusService extends BiletAllService {
  constructor(
    biletAllApiConfigService: BiletAllApiConfigService,
    private biletAllBusParserService: BiletAllBusParserService,
  ) {
    super(biletAllApiConfigService);
  }

  async company(requestDto: BusCompanyRequestDto): Promise<BusCompanyDto[]> {
    const companiesXml = `<Firmalar><FirmaNo>${
      requestDto.companyNo ?? 0
    }</FirmaNo></Firmalar>`;
    const res = await this.run<BiletAllCompanyResponse>(companiesXml);
    return this.biletAllBusParserService.parseCompany(res);
  }

  async busTerminals(): Promise<BusTerminalDto[]> {
    const stopPointsXml = `<KaraNoktaGetirKomut/>`;
    const res = await this.run<BusStopPointResponse>(stopPointsXml);
    return this.biletAllBusParserService.parseBusTerminals(res);
  }

  async scheduleList(
    requestDto: BusScheduleRequestDto,
  ): Promise<BusScheduleListResponseDto> {
    const builder = new xml2js.Builder({ headless: true });

    const requestDocument = {
      Sefer: {
        FirmaNo: requestDto.companyNo ?? '0',
        KalkisNoktaID: requestDto.departurePointId,
        VarisNoktaID: requestDto.arrivalPointId,
        Tarih: dayjs(requestDto.date).format('YYYY-MM-DD'),
        AraNoktaGelsin: requestDto.includeIntermediatePoints ?? 1,
        IslemTipi: requestDto.operationType ?? 0,
        YolcuSayisi: '1',
        Ip: requestDto.ip,
      },
    };

    const xml = builder.buildObject(requestDocument);
    const departureResponsePromise =
      this.run<BusScheduleAndFeaturesResponse>(xml);

    let returnResponsePromise:
      | Promise<BusScheduleAndFeaturesResponse>
      | undefined;

    if (requestDto.returnDate) {
      const returnRequestDocument = {
        Sefer: {
          FirmaNo: requestDto.companyNo ?? '0',
          KalkisNoktaID: requestDto.arrivalPointId,
          VarisNoktaID: requestDto.departurePointId,
          Tarih: requestDto.returnDate,
          AraNoktaGelsin: requestDto.includeIntermediatePoints ?? 1,
          IslemTipi: requestDto.operationType ?? 0,
          YolcuSayisi: '1',
          Ip: requestDto.ip,
        },
      };

      const returnXml = builder.buildObject(returnRequestDocument);
      returnResponsePromise =
        this.run<BusScheduleAndFeaturesResponse>(returnXml);
    }
    const [departureSchedulesAndFeatures, returnSchedulesAndFeatures] =
      await Promise.all([departureResponsePromise, returnResponsePromise]);

    return {
      departureSchedulesAndFeatures:
        this.biletAllBusParserService.parseBusSchedule(
          departureSchedulesAndFeatures,
        ),
      returnSchedulesAndFeatures: returnSchedulesAndFeatures
        ? this.biletAllBusParserService.parseBusSchedule(
            returnSchedulesAndFeatures,
          )
        : undefined,
    };
  }

  async busTicketDetail(
    requestDto: BusTicketDetailRequestDto,
  ): Promise<BusTicketDetailDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Otobus: {
        FirmaNo: requestDto.companyNo,
        KalkisNoktaID: requestDto.departurePointId,
        VarisNoktaID: requestDto.arrivalPointId,
        Tarih: dayjs(requestDto.date).format('YYYY-MM-DD'),
        Saat: requestDto.time,
        HatNo: requestDto.routeNumber,
        IslemTipi: 0,
        YolcuSayisi: 1,
        SeferTakipNo: requestDto.tripTrackingNumber,
        Ip: '127.0.0.1',
      },
    };
    const xml = builder.buildObject(requestDocument);
    const busDetailPromise = this.run<BusResponse>(xml);

    const routeBuilder = new xml2js.Builder({ headless: true });
    const routeRequestDocument = {
      Hat: {
        FirmaNo: requestDto.companyNo,
        HatNo: requestDto.routeNumber,
        KalkisNoktaID: requestDto.departurePointId,
        VarisNoktaID: requestDto.arrivalPointId,
        BilgiIslemAdi: 'GuzergahVerSaatli',
        SeferTakipNo: requestDto.tripTrackingNumber,
        Tarih: dayjs(requestDto.date).format('YYYY-MM-DD'),
      },
    };
    const routeXml = routeBuilder.buildObject(routeRequestDocument);
    const routeDetailPromise = this.run<RouteDetailResponse>(routeXml);

    const [busDetail, routeDetail] = await Promise.all([
      busDetailPromise,
      routeDetailPromise,
    ]);

    return {
      busDetail:
        this.biletAllBusParserService.parseBusDetailResponse(busDetail),
      routeDetail: this.biletAllBusParserService.parseRouteDetail(routeDetail),
    };
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
        Tarih: dayjs(requestDto.date).format('YYYY-MM-DD'),
        Saat: requestDto.time,
        HatNo: requestDto.routeNumber,
        IslemTipi: requestDto.operationType ?? 0,
        SeferTakipNo: requestDto.tripTrackingNumber,
        Ip: requestDto.ip,
        Koltuklar: {
          Koltuk: requestDto.seats.map((seat) => ({
            KoltukNo: seat.seatNumber,
            Cinsiyet: BiletAllGender[seat.gender],
          })),
        },
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.run<BusSeatAvailabilityResponse>(xml);
    return this.biletAllBusParserService.parseBusSeatAvailability(res);
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
    return this.biletAllBusParserService.parseBoardingPoint(res);
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
        Tarih: requestDto.date,
        Saat: requestDto.time,
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.run<ServiceInformationResponse>(xml);
    return this.biletAllBusParserService.parseServiceInformation(res);
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
        Tarih: dayjs(requestDto.date).format('YYYY-MM-DD'),
      },
    };
    const xml = builder.buildObject(requestDocument);
    const res = await this.run<RouteDetailResponse>(xml);
    return this.biletAllBusParserService.parseRouteDetail(res);
  }

  // this method needs to define the payment strategy
  // Otobus cevap xml"i içerisinde,
  // OnOdemeAktifMi aktif mi parametresi sıfır geliyor ise firma posundan işlem yapılmalı.
  // 1 geliyor ise ön ödemeli satış(kendi posunuz ile) yapılabilinir.
  // private async transactionRules(busSearchDto: BusSearchRequestDto) {
  //   const { paymentRules } = await this.busSearch({
  //     companyNo: busSearchDto.companyNo,
  //     departurePointId: busSearchDto.departurePointId,
  //     arrivalPointId: busSearchDto.arrivalPointId,
  //     date: busSearchDto.date,
  //     time: busSearchDto.time,
  //     routeNumber: busSearchDto.routeNumber,
  //     operationType: busSearchDto.operationType,
  //     passengerCount: busSearchDto.passengerCount,
  //     tripTrackingNumber: busSearchDto.tripTrackingNumber,
  //     ip: busSearchDto.ip,
  //   });
  //   const rules: BiletallPaymentRules[] = [];
  //   if (paymentRules.prePaymentActive) {
  //     rules.push('VIRTUAL_POS');
  //   } else {
  //     rules.push('BUS_COMPANY_VIRTUAL_POS');
  //   }

  //   if (
  //     paymentRules.payment3DSecureActive &&
  //     paymentRules.payment3DSecureMandatory
  //   ) {
  //     rules.push('3D_SECURE');
  //   }

  //   console.log({ rules });
  // }

  // async saleRequest(requestDto: BusTicketPurchaseDto): Promise<any> {
  //   const builder = new xml2js.Builder({ headless: true });

  //   const {
  //     companyNo,
  //     departurePointId,
  //     arrivalPointId,
  //     date,
  //     time,
  //     routeNumber,
  //     passengers,
  //     tripTrackingNumber,
  //     webPassenger: { ip },
  //   } = requestDto;

  //   const passengerCount = passengers.length.toString();

  //   await this.transactionRules({
  //     companyNo: companyNo ?? '0',
  //     departurePointId: String(departurePointId),
  //     arrivalPointId: String(arrivalPointId),
  //     date,
  //     time,
  //     routeNumber: String(routeNumber),
  //     operationType: 0,
  //     passengerCount,
  //     tripTrackingNumber,
  //     ip,
  //   });

  //   const requestDocument = {
  //     IslemSatis: {
  //       FirmaNo: companyNo,
  //       KalkisNoktaID: departurePointId,
  //       VarisNoktaID: arrivalPointId,
  //       Tarih: dayjs(date).format('YYYY-MM-DD'),
  //       Saat: time,
  //       HatNo: routeNumber,
  //       SeferNo: tripTrackingNumber,
  //       KalkisTerminalAdiSaatleri: '',
  //       ...requestDto.passengers.reduce((acc, passenger, index) => {
  //         acc[`KoltukNo${index + 1}`] = passenger.seatNo;
  //         acc[`Adi${index + 1}`] = passenger.firstName;
  //         acc[`Soyadi${index + 1}`] = passenger.lastName;
  //         acc[`Cinsiyet${index + 1}`] = BiletAllGender[passenger.gender];
  //         acc[`TcVatandasiMi${index + 1}`] = passenger.isTurkishCitizen ? 1 : 0;
  //         acc[`TcKimlikNo${index + 1}`] = passenger.turkishIdNumber;
  //         acc[`PasaportUlkeKod${index + 1}`] = passenger.passportCountryCode;
  //         acc[`PasaportNo${index + 1}`] = passenger.passportNumber;
  //         if (passenger.boardingLocation)
  //           acc[`BinecegiYer${index + 1}`] = passenger.boardingLocation;
  //         if (passenger.departureServiceLocation)
  //           acc[`ServisYeriKalkis${index + 1}`] =
  //             passenger.departureServiceLocation;
  //         if (passenger.arrivalServiceLocation)
  //           acc[`ServisYeriVaris${index + 1}`] =
  //             passenger.arrivalServiceLocation;
  //         return acc;
  //       }, {}),
  //       TelefonNo: requestDto.phoneNumber,
  //       ToplamBiletFiyati: requestDto.totalTicketPrice,
  //       YolcuSayisi: passengerCount,
  //       BiletSeriNo: 1,
  //       OdemeSekli: 0,
  //       FirmaAciklama: undefined,
  //       HatirlaticiNot: undefined,
  //       SeyahatTipi: 0,
  //       WebYolcu: {
  //         WebUyeNo: 0,
  //         Ip: ip,
  //         Email: requestDto.webPassenger.email,
  //         ...(requestDto.webPassenger.creditCardNo && {
  //           KrediKartNo: requestDto.webPassenger.creditCardNo,
  //           KrediKartSahip: requestDto.webPassenger.creditCardHolder,
  //           KrediKartGecerlilikTarihi:
  //             requestDto.webPassenger.creditCardExpiryDate,
  //           KrediKartCCV2: requestDto.webPassenger.creditCardCCV2,
  //         }),
  //         ...(requestDto.webPassenger.prepaymentUsage && {
  //           OnOdemeKullan: requestDto.webPassenger.prepaymentUsage,
  //           OnOdemeTutar: requestDto.webPassenger.prepaymentAmount,
  //         }),
  //       },
  //     },
  //   };

  //   const xml = builder.buildObject(requestDocument);
  //   return this.run(xml);
  // }
}
