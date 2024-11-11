import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import { BiletAllPlaneParserService } from './biletall-plane-parser.service';

// dto
import { AbroadFlightScheduleDto } from '../../dto/plane-abroad-flight-schedule.dto';
import {
  PlanePullPriceFlightDto,
  PullPriceFlightRequestDto,
} from '../../dto/plane-pull-price-flight.dto';
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
import { FlightConvertReservationToSaleRequestDto } from '../../dto/plane-convert-reservation-to-sale.dto';
import { DomesticFlightScheduleDto } from '../../dto/plane-domestic-flight-schedule.dto';
import { PlaneAirportDto } from '../../dto/plane-airport.dto';

// enums
import { PlaneInvoiceType } from '@app/common/enums';

// types
import { PlanePullPriceResponse } from './types/biletall-plane-pull-price-flight.type';
import { DomesticFlightResponse } from './types/biletall-plane-domistic-flight-schedule.type';
import { AbroadFlightResponse } from './types/biletall-plane-abroad-flight-schedule.type';
import { PlaneTicketPurchaseResponse } from './types/biletall-plane-ticket-purchase.type';
import { PlaneAirportResponse } from './types/biletall-plane-airport.type';

// helpers
import { BiletAllFlightClassType } from './helpers/plane-flight-class-type.helper';
import { BiletAllPlaneInvoiceType } from './helpers/plane-invoice-type.helper';
import { BiletAllPlanePassengerType } from './helpers/plane-passanger-type.helper';
import { BiletAllPlaneTicketOperationType } from './helpers/plane-ticket-operation-type.helper';
import { BiletAllPlaneTravelType } from './helpers/plane-travel-type.helper';
import { BiletAllGender } from '@app/common/helpers';
import { BiletAllService } from '@app/common/services/biletall.service';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { PlaneFlightScheduleRequestDto } from '../../dto/plane-flight-schedule.dto';
import {
  PullAbroadFlightPricePackagesRequestDto,
  PullAbroadFlightPricePackagesResponseDto,
} from '../../dto/plane-pull-abroad-flight-price-packages.dto';
import { pullAbroadFlightPricePackagesResponse } from './types/biletall-plane-pull-abroad-flight-price-packages.type';
import { turkishToEnglish } from '@app/common/utils';

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
        CocukSayi: requestDto.childCount ?? '0',
        BebekSayi: requestDto.babyCount ?? '0',
        OgrenciSayi: requestDto.studentCount ?? '0',
        YasliSayi: requestDto.olderCount ?? '0',
        AskerSayi: requestDto.militaryCount ?? '0',
        GencSayi: requestDto.youthCount ?? '0',
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
        CocukSayi: requestDto.childCount ?? '0',
        BebekSayi: requestDto.babyCount ?? '0',
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
    const segments = requestDto.segments.map((segment, index) => ({
      [`Segment${index + 1}`]: {
        Kalkis: segment.departure,
        Varis: segment.arrival,
        KalkisTarih: segment.departureDate,
        VarisTarih: segment.arrivalDate,
        UcusNo: segment.flightNumber,
        FirmaKod: segment.companyCode,
        Sinif: segment.flightClass,
        DonusMu: segment.isReturnFlight,
        SeferKod: segment.flightCode,
      },
    }));
    const requestDocument = {
      UcusFiyatPaket: {
        IslemId: requestDto.operationId,
        FirmaNo: 1100,
        ...segments.reduce((acc, segment) => ({ ...acc, ...segment }), {}),
        YetiskinSayi: requestDto.adultCount,
        CocukSayi: requestDto.childCount,
        BebekSayi: requestDto.babyCount,
        OgrenciSayi: requestDto.studentCount,
        YasliSayi: requestDto.olderCount,
        AskerSayi: requestDto.militaryCount,
        GencSayi: requestDto.youthCount,
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
    const res = await this.run<PlanePullPriceResponse>(xml);
    return this.biletAllPlaneParserService.parsePullPriceOfFlightResponse(res);
  }

  async planePassengerAgeRules(): Promise<PlanePassengerAgeRuleDto[]> {
    const xml = '<TasiyiciFirmaYolcuYasKurallar/>';
    const res = await this.run<PlanePassengerAgeRulesResponse>(xml);
    return this.biletAllPlaneParserService.parsePassengerAgeRule(res);
  }

  async planeTicketReservation(
    requestDto: FlightReservationRequestDto,
  ): Promise<FlightTicketReservationDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      IslemUcak_2: {
        IslemTip: BiletAllPlaneTicketOperationType.reservation,
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
            Ad: turkishToEnglish(passenger.firstName),
            Soyad: turkishToEnglish(passenger.lastName),
            Cinsiyet: BiletAllGender[passenger.gender],
            YolcuTip: BiletAllPlanePassengerType[passenger.passengerType],
            TCKimlikNo: passenger.turkishIdNumber,
            DogumTarih: passenger.birthday,
            ...(passenger.passportNumber && {
              PasaportNo: passenger.passportNumber,
            }),
            ...(passenger.passportExpiryDate && {
              PasaportGecerlilikTarihi: passenger.passportExpiryDate,
            }),
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
    const res = await this.run<PlaneTicketReservationResponse>(xml);
    return this.biletAllPlaneParserService.parseFlightTicketReservation(res);
  }

  async planeTicketPurchase(
    requestDto: FlightTicketPurchaseRequestDto,
  ): Promise<FlightTicketPurchaseDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      IslemUcak_2: {
        IslemTip: BiletAllPlaneTicketOperationType.purchase,
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
            Ad: turkishToEnglish(passenger.firstName),
            Soyad: turkishToEnglish(passenger.lastName),
            Cinsiyet: BiletAllGender[passenger.gender],
            YolcuTip: BiletAllPlanePassengerType[passenger.passengerType],
            TCKimlikNo: passenger.turkishIdNumber,
            DogumTarih: passenger.birthday,
            ...(passenger.passportNumber && {
              PasaportNo: passenger.passportNumber,
            }),
            ...(passenger.passportExpiryDate && {
              PasaportGecerlilikTarihi: passenger.passportExpiryDate,
            }),
            MilNo: passenger.passportNumber || '',
            NetFiyat: passenger.netPrice || 0,
            Vergi: passenger.tax || 0,
            ServisUcret: passenger.serviceFee || 0,
          };
          return acc;
        }, {}),
        ...(requestDto.invoice && {
          Fatura: {
            FaturaTip: BiletAllPlaneInvoiceType[requestDto.invoice.invoiceType],

            ...(requestDto.invoice.invoiceType ===
              PlaneInvoiceType.INDIVIDUAL && {
              KisiAd: requestDto.invoice.individualFirstName,
              KisiSoyad: requestDto.invoice.individualLastName,
              KisiTCKimlikNo: requestDto.invoice.individualTurkishIdNumber,
              KisiAdres: requestDto.invoice.individualAddress,
            }),
            ...(requestDto.invoice.invoiceType ===
              PlaneInvoiceType.CORPORATE && {
              FirmaAd: requestDto.invoice.companyName,
              FirmaVergiNo: requestDto.invoice.companyTaxNumber,
              FirmaVergiDairesi: requestDto.invoice.companyTaxOffice,
              FirmaAdres: requestDto.invoice.companyAddress,
            }),
          },
        }),
        WebYolcu: {
          Ip: requestDto.webPassenger.ip,
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
    const res = await this.run<PlaneTicketPurchaseResponse>(xml);

    return this.biletAllPlaneParserService.parseFlightTicketPurchase(res);
  }

  async planeConvertReservationToSale(
    requestDto: FlightConvertReservationToSaleRequestDto,
  ): Promise<any> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      IslemUcak_2: {
        IslemTip: BiletAllPlaneTicketOperationType.purchase,
        FirmaNo: requestDto.companyNo,
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
            Ad: turkishToEnglish(passenger.firstName),
            Soyad: turkishToEnglish(passenger.lastName),
            Cinsiyet: BiletAllGender[passenger.gender],
            YolcuTip: BiletAllPlanePassengerType[passenger.passengerType],
            ...(passenger.turkishIdNumber && {
              TCKimlikNo: passenger.turkishIdNumber,
            }),
            ...(passenger.passportNumber && {
              PasaportNo: passenger.passportNumber,
            }),
            ...(passenger.passportExpiryDate && {
              PasaportGecerlilikTarihi: passenger.passportExpiryDate,
            }),
            MilNo: passenger.passportNumber || '',
            NetFiyat: passenger.netPrice || 0,
            Vergi: passenger.tax || 0,
            ServisUcret: passenger.serviceFee || 0,
          };
          return acc;
        }, {}),
        ...(requestDto.invoice && {
          Fatura: {
            FaturaTip: BiletAllPlaneInvoiceType[requestDto.invoice.invoiceType],

            ...(requestDto.invoice.invoiceType ===
              PlaneInvoiceType.INDIVIDUAL && {
              KisiAd: requestDto.invoice.individualFirstName,
              KisiSoyad: requestDto.invoice.individualLastName,
              KisiTCKimlikNo: requestDto.invoice.individualTurkishIdNumber,
              KisiAdres: requestDto.invoice.individualAddress,
            }),
            ...(requestDto.invoice.invoiceType ===
              PlaneInvoiceType.CORPORATE && {
              FirmaAd: requestDto.invoice.companyName,
              FirmaVergiNo: requestDto.invoice.companyTaxNumber,
              FirmaVergiDairesi: requestDto.invoice.companyTaxOffice,
              FirmaAdres: requestDto.invoice.companyAddress,
            }),
          },
        }),
        WebYolcu: {
          Ip: requestDto.webPassenger.ip,
          KartNo: requestDto.webPassenger.creditCardNumber,
          KartSahibi: requestDto.webPassenger.creditCardHolderName,
          SonKullanmaTarihi: requestDto.webPassenger.creditCardExpiryDate,
          CCV2: requestDto.webPassenger.creditCardCCV2,
          RezervasyonPNR: requestDto.webPassenger.reservationPnrCode,
        },
      },
    };

    const xml = builder.buildObject(requestDocument);
    const res = await this.run<any>(xml);

    return this.biletAllPlaneParserService.parseFlightTicketPurchase(res);
  }
}
