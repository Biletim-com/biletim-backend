import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import * as dayjs from 'dayjs';

// entites
import { Transaction } from '@app/modules/transactions/transaction.entity';
import { BusTicket } from '../../entities/bus-ticket.entity';
import { Order } from '@app/modules/orders/order.entity';

// services
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { BiletAllBusParserService } from './biletall-bus-parser.service';
import { BiletAllService } from '@app/common/services/biletall.service';

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
import { BankCardDto } from '@app/common/dtos';
import { BusTerminalDto } from '../../dto/bus-terminal.dto';
import {
  BusSeatAvailabilityDto,
  BusSeatAvailabilityRequestDto,
} from '../../dto/bus-seat-availability.dto';
import { BusTicketSaleDto } from '../../dto/bus-ticket-sale.dto';

// types
import { BiletAllCompanyResponse } from './types/biletall-company.type';
import { BusStopPointResponse } from './types/biletall-bus-terminal.type';
import { BusScheduleAndFeaturesResponse } from './types/biletall-trip-search.type';
import { BusResponse } from './types/biletall-bus-search.type';
import { RouteDetailResponse } from './types/biletall-route.type';
import { ServiceInformationResponse } from './types/biletall-service-information.type';
import { BoardingPointResponse } from './types/biletall-boarding-point.type';
import { BusSeatAvailabilityResponse } from './types/biletall-bus-seat-availability.type';
import { BiletallPaymentRules } from '@app/common/types';
import { BusTicketSaleRequestResponse } from './types/biletall-sale-request.type';

// helpers
import { BiletAllGender } from '@app/common/helpers';

// utils
import { turkishToEnglish } from '@app/common/utils';

@Injectable()
export class BiletAllBusService extends BiletAllService {
  constructor(
    biletAllApiConfigService: BiletAllApiConfigService,
    private biletAllBusParserService: BiletAllBusParserService,
  ) {
    super(biletAllApiConfigService);
  }

  private busDetails(
    clientIp: string,
    dto: BusTicketDetailRequestDto,
  ): Promise<BusResponse> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      Otobus: {
        FirmaNo: dto.companyNumber,
        KalkisNoktaID: dto.departurePointId,
        VarisNoktaID: dto.arrivalPointId,
        Tarih: dto.date,
        Saat: dto.time,
        HatNo: dto.routeNumber,
        IslemTipi: 0, // Purchase
        YolcuSayisi: 1,
        SeferTakipNo: dto.tripTrackingNumber,
        Ip: clientIp,
      },
    };
    const xml = builder.buildObject(requestDocument);
    return this.run<BusResponse>(xml);
  }

  async company(requestDto: BusCompanyRequestDto): Promise<BusCompanyDto[]> {
    const companiesXml = `<Firmalar><FirmaNo>${
      requestDto.companyNumber ?? 0
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
    clientIp: string,
    requestDto: BusScheduleRequestDto,
  ): Promise<BusScheduleListResponseDto> {
    const builder = new xml2js.Builder({ headless: true });

    const requestDocument = {
      Sefer: {
        FirmaNo: requestDto.companyNumber ?? '0',
        KalkisNoktaID: requestDto.departurePointId,
        VarisNoktaID: requestDto.arrivalPointId,
        Tarih: dayjs(requestDto.date).format('YYYY-MM-DD'),
        AraNoktaGelsin: requestDto.includeIntermediatePoints ?? 1,
        IslemTipi: 0,
        YolcuSayisi: '1',
        Ip: clientIp,
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
          FirmaNo: requestDto.companyNumber ?? '0',
          KalkisNoktaID: requestDto.arrivalPointId,
          VarisNoktaID: requestDto.departurePointId,
          Tarih: requestDto.returnDate,
          AraNoktaGelsin: requestDto.includeIntermediatePoints ?? 1,
          IslemTipi: 0,
          YolcuSayisi: '1',
          Ip: clientIp,
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
    clientIp: string,
    requestDto: BusTicketDetailRequestDto,
  ): Promise<BusTicketDetailDto> {
    const busDetailPromise = this.busDetails(clientIp, requestDto);

    const routeBuilder = new xml2js.Builder({ headless: true });
    const routeRequestDocument = {
      Hat: {
        FirmaNo: requestDto.companyNumber,
        HatNo: requestDto.routeNumber,
        KalkisNoktaID: requestDto.departurePointId,
        VarisNoktaID: requestDto.arrivalPointId,
        BilgiIslemAdi: 'GuzergahVerSaatli',
        SeferTakipNo: requestDto.tripTrackingNumber,
        Tarih: requestDto.date,
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
    clientIp: string,
    requestDto: BusSeatAvailabilityRequestDto,
  ): Promise<BusSeatAvailabilityDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      OtobusKoltukKontrol: {
        FirmaNo: requestDto.companyNumber,
        KalkisNoktaID: requestDto.departurePointId,
        VarisNoktaID: requestDto.arrivalPointId,
        Tarih: requestDto.date,
        Saat: requestDto.time,
        HatNo: requestDto.routeNumber,
        IslemTipi: 0,
        SeferTakipNo: requestDto.tripTrackingNumber,
        Ip: clientIp,
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
        FirmaNo: requestDto.companyNumber,
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
        FirmaNo: requestDto.companyNumber,
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

  // this method needs to define the payment strategy
  // Otobus cevap xml"i içerisinde,
  // OnOdemeAktifMi aktif mi parametresi sıfır geliyor ise firma posundan işlem yapılmalı.
  // 1 geliyor ise ön ödemeli satış(kendi posunuz ile) yapılabilinir.
  public async getForeignSaleEligibilityAndTransactionRules(
    clientIp: string,
    dto: BusTicketDetailRequestDto,
  ): Promise<{
    canSellToForeigners: boolean;
    transactionRules: BiletallPaymentRules[];
  }> {
    const response = await this.busDetails(clientIp, dto);

    const {
      paymentRules,
      bus: { idNumberRequiredForBranchSale, canProcessWithPassportNumber },
    } = this.biletAllBusParserService.parseBusDetailResponse(response);

    const transactionRules: BiletallPaymentRules[] = [];
    if (paymentRules.prePaymentActive) {
      transactionRules.push('INTERNAL_VIRTUAL_POS');
    }
    if (
      paymentRules.payment3DSecureActive ||
      paymentRules.payment3DSecureMandatory
    ) {
      transactionRules.push('COMPANY_VIRTUAL_POS');
    }

    let canSellToForeigners = true;
    if (idNumberRequiredForBranchSale && !canProcessWithPassportNumber) {
      canSellToForeigners = false;
    }

    return { canSellToForeigners, transactionRules };
  }

  /**
   * SALE REQUEST
   */

  // Overload signatures
  async saleRequest(
    clientIp: string,
    transaction: Transaction,
    order: Order,
    tickets: BusTicket[],
    bankCard: BankCardDto,
  ): Promise<string>;

  async saleRequest(
    clientIp: string,
    transaction: Transaction,
    order: Order,
    tickets: BusTicket[],
    bankCard?: undefined,
  ): Promise<BusTicketSaleDto>;

  async saleRequest(
    clientIp: string,
    transaction: Transaction,
    order: Order,
    tickets: BusTicket[],
    bankCard?: BankCardDto,
  ): Promise<BusTicketSaleDto | string> {
    const builder = new xml2js.Builder({
      headless: true,
      renderOpts: { pretty: false },
    });
    const {
      companyNumber,
      routeNumber,
      tripTrackingNumber,
      departureTerminal,
      arrivalTerminal,
      travelStartDateTime,
    } = tickets[0];
    const date = dayjs(travelStartDateTime).format('YYYY-MM-DD');

    const requestDocument = {
      IslemSatis: {
        FirmaNo: companyNumber,
        KalkisNoktaID: departureTerminal.externalId,
        VarisNoktaID: arrivalTerminal.externalId,
        Tarih: date,
        Saat: travelStartDateTime,
        HatNo: routeNumber,
        SeferNo: tripTrackingNumber,
        KalkisTerminalAdiSaatleri: '',
        ...tickets.reduce((acc, passenger, index) => {
          acc[`KoltukNo${index + 1}`] = passenger.seatNumber;
          acc[`Adi${index + 1}`] = turkishToEnglish(passenger.firstName);
          acc[`Soyadi${index + 1}`] = turkishToEnglish(passenger.lastName);
          acc[`Cinsiyet${index + 1}`] = BiletAllGender[passenger.gender];
          acc[`TcVatandasiMi${index + 1}`] = passenger.isTurkishCitizen ? 1 : 0;

          if (passenger.isTurkishCitizen) {
            acc[`TcKimlikNo${index + 1}`] = passenger.tcNumber;
          } else {
            acc[`PasaportUlkeKod${index + 1}`] = passenger.passportCountryCode;
            acc[`PasaportNo${index + 1}`] = passenger.passportNumber;
          }
          return acc;
        }, {}),
        TelefonNo: order.userPhoneNumber,
        ToplamBiletFiyati: transaction.amount, // with 2 precision -> 150.00
        YolcuSayisi: tickets.length,
        BiletSeriNo: 1, // constant
        OdemeSekli: 0, // constant
        SeyahatTipi: 0, // constant
        WebYolcu: {
          WebUyeNo: 0, // constant
          Ip: clientIp,
          Email: order.userEmail,
          // if credit card passed this means we purchase via biletall
          ...(bankCard?.pan
            ? {
                KrediKartNo: bankCard.pan,
                KrediKartSahip: bankCard.holderName,
                KrediKartGecerlilikTarihi: dayjs(bankCard.expiryDate).format(
                  'MM.YYYY',
                ),
                KrediKartCCV2: bankCard.cvv,
              }
            : {
                OnOdemeKullan: 1,
                OnOdemeTutar: transaction.amount,
              }),
        },
      },
    };

    const xml = builder.buildObject(requestDocument);
    if (bankCard) return xml;

    const res = await this.run<BusTicketSaleRequestResponse>(xml);
    return this.biletAllBusParserService.parseSaleRequest(res);
  }
}
