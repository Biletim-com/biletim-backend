import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';
import * as dayjs from 'dayjs';

// services
import { TicketConfigService } from '@app/configs/ticket';
import { BiletAllRequestService } from '../../services/biletall-request.service';
import { BiletAllBusSearchParserService } from '../parsers/biletall-bus-search.parser.service';

// request dtos
import { BoardingPointRequestDto } from '../dto/bus-boarding-point.dto';
import { ServiceInformationRequestDto } from '../dto/bus-service-information.dto';
import { BusCompanyRequestDto } from '@app/search/bus/dto/bus-company.dto';
import { BusScheduleRequestDto } from '@app/search/bus/dto/bus-schedule-list.dto';
import { BusSeatAvailabilityRequestDto } from '@app/search/bus/dto/bus-seat-availability.dto';
import { BusTicketDetailRequestDto } from '@app/search/bus/dto/bus-ticket-detail.dto';

// parser dtos
import { BusTicketDetailDto } from '../dto/bus-ticket-detail.dto';
import { BoardingPointDto } from '../dto/bus-boarding-point.dto';
import { ServiceInformationDto } from '../dto/bus-service-information.dto';
import { BusSeatAvailabilityDto } from '../dto/bus-seat-availability.dto';
import { BusCompanyDto } from '../dto/bus-company.dto';
import { BusTerminalDto } from '../dto/bus-terminal.dto';
import { BusScheduleListResponseDto } from '../dto/bus-schedule-list.dto';

// types
import { BusTripScheduleAndFeaturesResponse } from '../types/biletall-bus-trip-schedule.type';
import { BusResponse } from '../types/biletall-bus-search.type';
import { BusRouteDetailResponse } from '../types/biletall-bus-route.type';
import { BusServiceInformationResponse } from '../types/biletall-bus-service-information.type';
import { BusBoardingPointResponse } from '../types/biletall-bus-boarding-point.type';
import { BusSeatAvailabilityResponse } from '../types/biletall-bus-seat-availability.type';
import { BiletallPaymentRules } from '../../types/biletall-payment-rules.type';
import { BusCompaniesResponse } from '../types/biletall-bus-company.type';
import { BusTerminalPointResponse } from '../types/biletall-bus-terminal.type';

// helpers
import { BiletAllGender } from '../../helpers/biletall-gender.helper';

@Injectable()
export class BiletAllBusSearchService {
  private readonly biletAllRequestService: BiletAllRequestService;
  constructor(
    ticketConfigService: TicketConfigService,
    private readonly biletAllBusSearchParserService: BiletAllBusSearchParserService,
  ) {
    this.biletAllRequestService = new BiletAllRequestService(
      ticketConfigService.biletAllBaseUrl,
      ticketConfigService.biletAllUsername,
      ticketConfigService.biletAllPassword,
    );
  }

  async searchTripSchedules(
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
      this.biletAllRequestService.run<BusTripScheduleAndFeaturesResponse>(xml);

    let returnResponsePromise:
      | Promise<BusTripScheduleAndFeaturesResponse>
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
        this.biletAllRequestService.run<BusTripScheduleAndFeaturesResponse>(
          returnXml,
        );
    }
    const [departureSchedulesAndFeatures, returnSchedulesAndFeatures] =
      await Promise.all([departureResponsePromise, returnResponsePromise]);

    return {
      departureSchedulesAndFeatures:
        this.biletAllBusSearchParserService.parseTripSchedule(
          departureSchedulesAndFeatures,
        ),
      returnSchedulesAndFeatures: returnSchedulesAndFeatures
        ? this.biletAllBusSearchParserService.parseTripSchedule(
            returnSchedulesAndFeatures,
          )
        : undefined,
    };
  }

  async busTerminals(): Promise<BusTerminalDto[]> {
    const stopPointsXml = `<KaraNoktaGetirKomut/>`;
    const res = await this.biletAllRequestService.run<BusTerminalPointResponse>(
      stopPointsXml,
    );
    return this.biletAllBusSearchParserService.parseBusTerminals(res);
  }

  async companies(requestDto: BusCompanyRequestDto): Promise<BusCompanyDto[]> {
    const companiesXml = `<Firmalar><FirmaNo>${
      requestDto.companyNumber ?? 0
    }</FirmaNo></Firmalar>`;
    const res = await this.biletAllRequestService.run<BusCompaniesResponse>(
      companiesXml,
    );
    return this.biletAllBusSearchParserService.parseCompany(res);
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
    return this.biletAllRequestService.run<BusResponse>(xml);
  }

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
    } = this.biletAllBusSearchParserService.parseBusDetails(response);

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
    const routeDetailPromise =
      this.biletAllRequestService.run<BusRouteDetailResponse>(routeXml);

    const [busDetail, routeDetail] = await Promise.all([
      busDetailPromise,
      routeDetailPromise,
    ]);

    return {
      busDetail: this.biletAllBusSearchParserService.parseBusDetails(busDetail),
      routeDetail:
        this.biletAllBusSearchParserService.parseRouteDetail(routeDetail),
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
    const res =
      await this.biletAllRequestService.run<BusSeatAvailabilityResponse>(xml);
    return this.biletAllBusSearchParserService.parseBusSeatAvailability(res);
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
    const res = await this.biletAllRequestService.run<BusBoardingPointResponse>(
      xml,
    );
    return this.biletAllBusSearchParserService.parseBoardingPoint(res);
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
    const res =
      await this.biletAllRequestService.run<BusServiceInformationResponse>(xml);
    return this.biletAllBusSearchParserService.parseServiceInformation(res);
  }
}
