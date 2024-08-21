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
import { PlanePassengerAgeRuleDto } from '../../dto/plane-company-passenger-age-rule.dto';
import {
  FlightReservationRequestDto,
  FlightTicketReservationDto,
} from '../../dto/plane-ticket-reservation.dto';
import { PlaneTicketReservationResponse } from './types/biletall-plane-ticket-reservation.type';
import {
  FlightTicketPurchaseDto,
  FlightTicketPurchaseRequestDto,
} from '../../dto/plane-ticket-purchase.dto';
import { PlaneTicketPurchaseResponse } from './types/biletall-plane-ticket-purchase.type';

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

  async planePassengerAgeRules(): Promise<PlanePassengerAgeRuleDto[]> {
    const xml = '<TasiyiciFirmaYolcuYasKurallar/>';
    const res = await this.biletallService.run<PlanePassengerAgeRulesResponse>(
      xml,
    );
    return this.biletallPlaneParser.parsePassengerAgeRule(res);
  }

  async planeTicketReservation(
    requestDto: FlightReservationRequestDto,
  ): Promise<FlightTicketReservationDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      IslemUcak_2: {
        IslemTip: '1' || '0',
        FirmaNo: requestDto.companyNo,
        TelefonNo: requestDto.phoneNumber,
        CepTelefonNo: requestDto.mobilePhoneNumber,
        Email: requestDto.email,
        HatirlaticiNot: '',
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
        ...requestDto.passengers.reduce((acc, passenger, index) => {
          acc[`Yolcu${index + 1}`] = {
            Ad: passenger.firstName,
            Soyad: passenger.lastName,
            Cinsiyet: passenger.gender,
            YolcuTip: passenger.passengerType,
            TCKimlikNo: passenger.turkishIdNumber,
            DogumTarih: passenger.birthday,
            MilNo: passenger.passportNumber || '',
            NetFiyat: passenger.netPrice || 0,
            Vergi: passenger.tax || 0,
            ServisUcret: passenger.serviceFee || 0,
          };
          return acc;
        }, {}),
      },
    };

    const xml = builder.buildObject(requestDocument);
    const res = await this.biletallService.run<PlaneTicketReservationResponse>(
      xml,
    );
    return this.biletallPlaneParser.parseFlightTicketReservation(res);
  }

  async planeTicketPurchase(
    requestDto: FlightTicketPurchaseRequestDto,
  ): Promise<FlightTicketPurchaseDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      IslemUcak_2: {
        IslemTip: requestDto.operationType,
        FirmaNo: requestDto.companyNo,
        TelefonNo: requestDto.phoneNumber,
        CepTelefonNo: requestDto.mobilePhoneNumber,
        Email: requestDto.email,
        HatirlaticiNot: '',
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
        ...requestDto.passengers.reduce((acc, passenger, index) => {
          acc[`Yolcu${index + 1}`] = {
            Ad: passenger.firstName,
            Soyad: passenger.lastName,
            Cinsiyet: passenger.gender,
            YolcuTip: passenger.passengerType,
            TCKimlikNo: passenger.turkishIdNumber,
            DogumTarih: passenger.birthday,
            MilNo: passenger.passportNumber || '',
            NetFiyat: passenger.netPrice || 0,
            Vergi: passenger.tax || 0,
            ServisUcret: passenger.serviceFee || 0,
          };
          return acc;
        }, {}),
        ...(requestDto.invoice && {
          Fatura: {
            FaturaTip: requestDto.invoice.invoiceType === 0 ? '0' : '1',

            ...(requestDto.invoice.invoiceType === 0 && {
              KisiAd: requestDto.invoice.individualFirstName,
              KisiSoyad: requestDto.invoice.individualLastName,
              KisiTCKimlikNo: requestDto.invoice.individualTurkishIdNumber,
              KisiAdres: requestDto.invoice.individualAddress,
            }),
            ...(requestDto.invoice.invoiceType === 1 && {
              FirmaAd: requestDto.invoice.companyName,
              FirmaVergiNo: requestDto.invoice.companyTaxNumber,
              FirmaVergiDairesi: requestDto.invoice.companyTaxOffice,
              FirmaAdres: requestDto.invoice.companyAddress,
            }),
          },
        }),
        WebYolcu: {
          KartNo: requestDto.webPassenger.creditCardNumber,
          KartSahibi: requestDto.webPassenger.creditCardHolderName,
          SonKullanmaTarihi: requestDto.webPassenger.creditCardExpiryDate,
          CCV2: requestDto.webPassenger.creditCardCCV2,
          ...(requestDto.webPassenger.openTicketPnrCode && {
            AcikBiletPNR: requestDto.webPassenger.openTicketPnrCode,
          }),
          ...(requestDto.webPassenger.openTicketSurname && {
            AcikBiletSoyad: requestDto.webPassenger.openTicketSurname,
          }),
          ...(requestDto.webPassenger.openTicketAmount && {
            AcikBiletMiktar: requestDto.webPassenger.openTicketAmount,
          }),
          ...(requestDto.webPassenger.reservationPnrCode && {
            RezervasyonPNR: requestDto.webPassenger.reservationPnrCode,
          }),
        },
      },
    };

    const xml = builder.buildObject(requestDocument);
    const res = await this.biletallService.run<PlaneTicketPurchaseResponse>(
      xml,
    );

    return this.biletallPlaneParser.parseFlightTicketPurchase(res);
  }
}
