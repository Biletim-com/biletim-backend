import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { BusController } from '@app/modules/tickets/bus/bus.controller';
import { BusCompanyRequestDto } from '@app/modules/tickets/bus/dto/bus-company.dto';
import { BiletAllParser } from '@app/modules/tickets/bus/services/biletall/biletall-bus.parser';
import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import {
  boardingPointMockResponse,
  busCompanyMockResponse,
  busSearchMockResponse,
  busSeatAvailabilityMockResponse,
  getBusTerminalsByNameMockResponse,
  getRouteMockResponse,
  scheduleListMockResponse,
  serviceInformationMockResponse,
} from '../../mock-response/biletall-bus-service-mock-response';
import { BusService } from '@app/modules/tickets/bus/services/bus.service';
import { BusTerminalRepository } from '@app/modules/tickets/bus/repositories/bus-terminal.repository';
import { DataSource } from 'typeorm';
import { BusScheduleRequestDto } from '@app/modules/tickets/bus/dto/bus-schedule-list.dto';
import { BusSearchRequestDto } from '@app/modules/tickets/bus/dto/bus-search.dto';
import { BusSeatAvailabilityRequestDto } from '@app/modules/tickets/bus/dto/bus-seat-availability.dto';
import { Gender } from '@app/common/enums';
import { BoardingPointRequestDto } from '@app/modules/tickets/bus/dto/bus-boarding-point.dto';
import { ServiceInformationRequestDto } from '@app/modules/tickets/bus/dto/bus-service-information.dto';
import { BusRouteRequestDto } from '@app/modules/tickets/bus/dto/bus-route.dto';

describe('BiletAllBusService', () => {
  const mockParser = {
    parseCompany: jest.fn(),
    parseBusTerminals: jest.fn(),
    parseBusSchedule: jest.fn(),
    parseBusSearchResponse: jest.fn(),
    parseBusSeatAvailability: jest.fn(),
    parseBoardingPoint: jest.fn(),
    parseServiceInformation: jest.fn(),
    parseRouteDetail: jest.fn(),
  };
  const mockRun = jest.fn();

  let service: BiletAllBusService;
  let mockDataSource: Partial<DataSource>;

  beforeEach(async () => {
    mockDataSource = {
      createEntityManager: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        BiletAllBusService,
        BiletAllApiConfigService,
        BusService,
        BusTerminalRepository,
        {
          provide: BiletAllParser,
          useValue: mockParser,
        },
        { provide: DataSource, useValue: mockDataSource },
      ],
      controllers: [BusController],
    }).compile();

    service = module.get<BiletAllBusService>(BiletAllBusService);
    service['run'] = mockRun;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('company method', () => {
    it('should return informations of relevant company', async () => {
      const requestDto: BusCompanyRequestDto = { companyNo: '2' };
      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/get-company.response.xml',
        ),
        'utf-8',
      );

      mockRun.mockResolvedValueOnce(mockXmlResponse);
      mockParser.parseCompany.mockResolvedValueOnce(busCompanyMockResponse);
      const result = await service.company(requestDto);

      expect(mockRun).toHaveBeenCalledWith(
        `<Firmalar><FirmaNo>${requestDto.companyNo}</FirmaNo></Firmalar>`,
      );
      expect(mockParser.parseCompany).toBeCalledWith(mockXmlResponse);
      expect(result).toStrictEqual(busCompanyMockResponse);
    });
  });

  describe('busTerminals method', () => {
    it('should return all bus terminals', async () => {
      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/bus-get-terminals.response.xml',
        ),
        'utf-8',
      );

      mockRun.mockResolvedValueOnce(mockXmlResponse);
      mockParser.parseBusTerminals.mockResolvedValueOnce(
        getBusTerminalsByNameMockResponse,
      );
      const result = await service.busTerminals();

      expect(mockRun).toHaveBeenCalledWith(`<KaraNoktaGetirKomut/>`);
      expect(mockParser.parseBusTerminals).toBeCalledWith(mockXmlResponse);
      expect(result).toStrictEqual(getBusTerminalsByNameMockResponse);
    });
  });

  describe('scheduleList method', () => {
    it('should return schedule list and feature of flight', async () => {
      const requestDto: BusScheduleRequestDto = {
        companyNo: '37',
        departurePointId: '84',
        arrivalPointId: '738',
        date: '2024-10-15',
        includeIntermediatePoints: 1,
        operationType: 0,
        ip: '127.0.0.1',
        passengerCount: '1',
      };

      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/schedule-list.response.xml',
        ),
        'utf-8',
      );

      mockRun.mockResolvedValueOnce(mockXmlResponse);
      mockParser.parseBusSchedule.mockResolvedValueOnce(
        scheduleListMockResponse,
      );
      const result = await service.scheduleList(requestDto);
      const expectedXml =
        `<Sefer>\n` +
        `  <FirmaNo>${requestDto.companyNo}</FirmaNo>\n` +
        `  <KalkisNoktaID>${requestDto.departurePointId}</KalkisNoktaID>\n` +
        `  <VarisNoktaID>${requestDto.arrivalPointId}</VarisNoktaID>\n` +
        `  <Tarih>${requestDto.date}</Tarih>\n` +
        `  <AraNoktaGelsin>${requestDto.includeIntermediatePoints}</AraNoktaGelsin>\n` +
        `  <IslemTipi>${requestDto.operationType}</IslemTipi>\n` +
        `  <YolcuSayisi>${requestDto.passengerCount}</YolcuSayisi>\n` +
        `  <Ip>${requestDto.ip}</Ip>\n` +
        `</Sefer>`;

      expect(mockRun).toHaveBeenCalledWith(expectedXml);
      expect(mockParser.parseBusSchedule).toBeCalledWith(mockXmlResponse);
      expect(result).toStrictEqual(scheduleListMockResponse);
    });
  });

  describe('BusSearch method', () => {
    it('should return seats situation and features of the relevant bus company', async () => {
      const requestDto: BusSearchRequestDto = {
        companyNo: '37',
        departurePointId: '84',
        arrivalPointId: '738',
        date: '2024-09-15',
        time: '1900-01-01T15:00:00.000Z',
        routeNumber: '3',
        operationType: 0,
        passengerCount: '1',
        tripTrackingNumber: '21115',
        ip: '127.0.0.1',
      };

      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/bus-search.response.xml',
        ),
        'utf-8',
      );

      mockRun.mockResolvedValueOnce(mockXmlResponse);
      mockParser.parseBusSearchResponse.mockResolvedValueOnce(
        busSearchMockResponse,
      );
      const result = await service.busSearch(requestDto);
      const expectedXml =
        `<Otobus>\n` +
        `  <FirmaNo>${requestDto.companyNo}</FirmaNo>\n` +
        `  <KalkisNoktaID>${requestDto.departurePointId}</KalkisNoktaID>\n` +
        `  <VarisNoktaID>${requestDto.arrivalPointId}</VarisNoktaID>\n` +
        `  <Tarih>${requestDto.date}</Tarih>\n` +
        `  <Saat>${requestDto.time}</Saat>\n` +
        `  <HatNo>${requestDto.routeNumber}</HatNo>\n` +
        `  <IslemTipi>${requestDto.operationType}</IslemTipi>\n` +
        `  <YolcuSayisi>${requestDto.passengerCount}</YolcuSayisi>\n` +
        `  <SeferTakipNo>${requestDto.tripTrackingNumber}</SeferTakipNo>\n` +
        `  <Ip>${requestDto.ip}</Ip>\n` +
        `</Otobus>`;

      expect(mockRun).toHaveBeenCalledWith(expectedXml);
      expect(mockParser.parseBusSearchResponse).toBeCalledWith(mockXmlResponse);
      expect(result).toStrictEqual(busSearchMockResponse);
    });
  });

  describe('busSeatAvailability method', () => {
    it('should return status of the company seat', async () => {
      const requestDto: BusSeatAvailabilityRequestDto = {
        companyNo: '37',
        departurePointId: '84',
        arrivalPointId: '738',
        date: '2024-09-20',
        time: '1900-01-01T22:00:00.000Z',
        routeNumber: '3',
        operationType: 0,
        tripTrackingNumber: '21202',
        ip: '127.0.0.1',
        seats: [
          {
            seatNumber: '1',
            gender: Gender.MALE,
          },
        ],
      };

      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/bus-seat-availability.response.xml',
        ),
        'utf-8',
      );

      mockRun.mockResolvedValueOnce(mockXmlResponse);

      mockParser.parseBusSeatAvailability.mockResolvedValueOnce(
        busSeatAvailabilityMockResponse,
      );
      const result = await service.busSeatAvailability(requestDto);
      const expectedXml =
        `<OtobusKoltukKontrol>\n` +
        `  <FirmaNo>${requestDto.companyNo}</FirmaNo>\n` +
        `  <KalkisNoktaID>${requestDto.departurePointId}</KalkisNoktaID>\n` +
        `  <VarisNoktaID>${requestDto.arrivalPointId}</VarisNoktaID>\n` +
        `  <Tarih>${requestDto.date}</Tarih>\n` +
        `  <Saat>${requestDto.time}</Saat>\n` +
        `  <HatNo>${requestDto.routeNumber}</HatNo>\n` +
        `  <IslemTipi>${requestDto.operationType}</IslemTipi>\n` +
        `  <SeferTakipNo>${requestDto.tripTrackingNumber}</SeferTakipNo>\n` +
        `  <Ip>${requestDto.ip}</Ip>\n` +
        `  <Koltuklar>\n` +
        `${requestDto.seats
          .map(
            (seat) =>
              `    <Koltuk>\n` +
              `      <KoltukNo>${seat.seatNumber}</KoltukNo>\n` +
              `      <Cinsiyet>${seat.gender === 'male' ? 2 : 1}</Cinsiyet>\n` +
              `    </Koltuk>\n`,
          )
          .join('')}` +
        `  </Koltuklar>\n` +
        `</OtobusKoltukKontrol>\n`;

      expect(mockRun).toHaveBeenCalledWith(expectedXml.trim());
      expect(mockParser.parseBusSeatAvailability).toBeCalledWith(
        mockXmlResponse,
      );
      expect(result).toStrictEqual(busSeatAvailabilityMockResponse);
    });
  });

  describe('boardingPoint method', () => {
    it('should return boarding point and time of the relevant expedition', async () => {
      const requestDto: BoardingPointRequestDto = {
        companyNo: '37',
        departurePointID: '738',
        localTime: '2024-09-25T03:00:00.000Z',
        routeNumber: '3',
      };

      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/bus-boarding-point.response.xml',
        ),
        'utf-8',
      );

      mockRun.mockResolvedValueOnce(mockXmlResponse);
      mockParser.parseBoardingPoint.mockResolvedValueOnce(
        boardingPointMockResponse,
      );
      const result = await service.boardingPoint(requestDto);
      const expectedXml =
        `<BinecegiYer>\n` +
        `  <FirmaNo>${requestDto.companyNo}</FirmaNo>\n` +
        `  <KalkisNoktaID>${requestDto.departurePointID}</KalkisNoktaID>\n` +
        `  <YerelSaat>${requestDto.localTime}</YerelSaat>\n` +
        `  <HatNo>${requestDto.routeNumber}</HatNo>\n` +
        `</BinecegiYer>`;

      expect(mockRun).toHaveBeenCalledWith(expectedXml);
      expect(mockParser.parseBoardingPoint).toBeCalledWith(mockXmlResponse);
      expect(result).toStrictEqual(boardingPointMockResponse);
    });
  });

  describe('serviceInformation method', () => {
    it('should return service information of the relevant expedition', async () => {
      const requestDto: ServiceInformationRequestDto = {
        companyNo: '37',
        departurePointID: '738',
        localTime: '2024-09-25T03:00:00.000Z',
        routeNumber: '3',
      };

      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/bus-service-information.response.xml',
        ),
        'utf-8',
      );

      mockRun.mockResolvedValueOnce(mockXmlResponse);
      mockParser.parseServiceInformation.mockResolvedValueOnce(
        serviceInformationMockResponse,
      );
      const result = await service.serviceInformation(requestDto);
      const expectedXml =
        `<Servis_2>\n` +
        `  <FirmaNo>${requestDto.companyNo}</FirmaNo>\n` +
        `  <KalkisNoktaID>${requestDto.departurePointID}</KalkisNoktaID>\n` +
        `  <YerelSaat>${requestDto.localTime}</YerelSaat>\n` +
        `  <HatNo>${requestDto.routeNumber}</HatNo>\n` +
        `  <Tarih/>\n` +
        `  <Saat/>\n` +
        `</Servis_2>`;

      expect(mockRun).toHaveBeenCalledWith(expectedXml.trim());
      expect(mockParser.parseServiceInformation).toBeCalledWith(
        mockXmlResponse,
      );
      expect(result).toStrictEqual(serviceInformationMockResponse);
    });
  });

  describe('getRoute method', () => {
    it('should return route information of the relevant expedition', async () => {
      const requestDto: BusRouteRequestDto = {
        companyNo: '37',
        routeNumber: '3',
        departurePointId: '84',
        arrivalPointId: '738',
        infoTechnologyName: 'GuzergahVerSaatli',
        tripTrackingNumber: '20454',
        date: '2024-08-05',
      };

      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/bus-get-route.response.xml',
        ),
        'utf-8',
      );

      mockRun.mockResolvedValueOnce(mockXmlResponse);
      mockParser.parseRouteDetail.mockResolvedValueOnce(getRouteMockResponse);
      const result = await service.getRoute(requestDto);
      const expectedXml =
        `<Hat>\n` +
        `  <FirmaNo>${requestDto.companyNo}</FirmaNo>\n` +
        `  <HatNo>${requestDto.routeNumber}</HatNo>\n` +
        `  <KalkisNoktaID>${requestDto.departurePointId}</KalkisNoktaID>\n` +
        `  <VarisNoktaID>${requestDto.arrivalPointId}</VarisNoktaID>\n` +
        `  <BilgiIslemAdi>${requestDto.infoTechnologyName}</BilgiIslemAdi>\n` +
        `  <SeferTakipNo>${requestDto.tripTrackingNumber}</SeferTakipNo>\n` +
        `  <Tarih>${requestDto.date}</Tarih>\n` +
        `</Hat>`;

      expect(mockRun).toHaveBeenCalledWith(expectedXml.trim());
      expect(mockParser.parseRouteDetail).toBeCalledWith(mockXmlResponse);
      expect(result).toStrictEqual(getRouteMockResponse);
    });
  });
});
