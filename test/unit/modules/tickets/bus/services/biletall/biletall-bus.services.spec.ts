import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { BusController } from '@app/modules/tickets/bus/bus.controller';
import { BusCompanyRequestDto } from '@app/modules/tickets/bus/dto/bus-company.dto';

import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import {
  boardingPointMockResponse,
  busCompanyMockResponse,
  busSeatAvailabilityMockResponse,
  departureScheduleListMockResponse,
  getBusTerminalsByNameMockResponse,
  returnScheduleListMockResponse,
  serviceInformationMockResponse,
} from '../../mock-response/biletall-bus-service-mock-response';
import { BusService } from '@app/modules/tickets/bus/services/bus.service';
import { BusTerminalRepository } from '@app/modules/tickets/bus/repositories/bus-terminal.repository';
import { DataSource } from 'typeorm';
import { BusSeatAvailabilityRequestDto } from '@app/modules/tickets/bus/dto/bus-seat-availability.dto';
import { Gender } from '@app/common/enums';
import { BoardingPointRequestDto } from '@app/modules/tickets/bus/dto/bus-boarding-point.dto';
import { ServiceInformationRequestDto } from '@app/modules/tickets/bus/dto/bus-service-information.dto';
import { BiletAllBusParserService } from '@app/modules/tickets/bus/services/biletall/biletall-bus-parser.service';
import { BiletAllParserService, BiletAllService } from '@app/common/services';
import { parseStringPromise } from 'xml2js';
import { BusScheduleRequestDto } from '@app/modules/tickets/bus/dto/bus-schedule-list.dto';

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
  const mockTransactionRules = jest.fn();

  let service: BiletAllBusService;
  let mockDataSource: Partial<DataSource>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockDataSource = {
      createEntityManager: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        BiletAllApiConfigService,
        BiletAllBusService,
        BusService,
        BusTerminalRepository,
        BiletAllService,
        BiletAllParserService,
        {
          provide: BiletAllBusParserService,
          useValue: mockParser,
        },
        { provide: DataSource, useValue: mockDataSource },
      ],
      controllers: [BusController],
    }).compile();

    service = module.get<BiletAllBusService>(BiletAllBusService);
    service['transactionRules'] = mockTransactionRules;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('company method', () => {
    it('should return informations of relevant company', async () => {
      const requestDto: BusCompanyRequestDto = { companyNo: '0' };
      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/get-company.response.xml',
        ),
        'utf-8',
      );

      const runSpy = jest
        .spyOn(BiletAllService.prototype, 'run')
        .mockResolvedValueOnce(mockXmlResponse);
      mockParser.parseCompany.mockResolvedValueOnce(busCompanyMockResponse);
      const result = await service.company(requestDto);

      expect(runSpy).toHaveBeenCalledWith(
        `<Firmalar><FirmaNo>${requestDto.companyNo}</FirmaNo></Firmalar>`,
      );
      expect(mockParser.parseCompany).toHaveBeenCalledWith(mockXmlResponse);
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

      const runSpy = jest
        .spyOn(BiletAllService.prototype, 'run')
        .mockResolvedValueOnce(mockXmlResponse);
      mockParser.parseBusTerminals.mockResolvedValueOnce(
        getBusTerminalsByNameMockResponse,
      );
      const result = await service.busTerminals();

      expect(runSpy).toHaveBeenCalledWith(`<KaraNoktaGetirKomut/>`);
      expect(mockParser.parseBusTerminals).toBeCalledWith(mockXmlResponse);
      expect(result).toStrictEqual(getBusTerminalsByNameMockResponse);
    });
  });

  describe('scheduleList method', () => {
    let runSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
    });

    afterEach(() => {
      if (runSpy) {
        runSpy.mockRestore();
      }
    });

    it('should return schedule list and feature of flight', async () => {
      const requestDto: BusScheduleRequestDto = {
        companyNo: '37',
        departurePointId: '84',
        arrivalPointId: '738',
        date: '2024-10-15',
        includeIntermediatePoints: 1,
        operationType: 0,
        ip: '127.0.0.1',
      };

      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/schedule-list.response.xml',
        ),
        'utf-8',
      );
      const jsonResult = await parseStringPromise(mockXmlResponse);

      runSpy = jest
        .spyOn(BiletAllService.prototype, 'run')
        .mockResolvedValueOnce(jsonResult);

      mockParser.parseBusSchedule.mockResolvedValueOnce(
        departureScheduleListMockResponse,
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
        `  <YolcuSayisi>1</YolcuSayisi>\n` +
        `  <Ip>${requestDto.ip}</Ip>\n` +
        `</Sefer>`;

      expect(runSpy).toHaveBeenCalledWith(expectedXml);
      expect(mockParser.parseBusSchedule).toHaveBeenCalledWith(jsonResult);

      const departureSchedulesAndFeatures =
        await result.departureSchedulesAndFeatures;

      expect(departureSchedulesAndFeatures).toStrictEqual(
        departureScheduleListMockResponse,
      );
    });

    it('should return schedule list and feature of flight for two requests', async () => {
      const requestDto: BusScheduleRequestDto = {
        companyNo: '37',
        departurePointId: '84',
        arrivalPointId: '738',
        date: '2024-10-15',
        includeIntermediatePoints: 1,
        operationType: 0,
        ip: '127.0.0.1',
      };

      const requestDto2: BusScheduleRequestDto = {
        ...requestDto,
        date: '2024-10-28',
      };

      const mockXmlResponse1 = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/schedule-list.response.xml',
        ),
        'utf-8',
      );

      const mockXmlResponse2 = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/bus-schedule-list-return-date.response.xml',
        ),
        'utf-8',
      );

      const jsonResult1 = await parseStringPromise(mockXmlResponse1);
      const jsonResult2 = await parseStringPromise(mockXmlResponse2);

      runSpy = jest
        .spyOn(BiletAllService.prototype, 'run')
        .mockResolvedValueOnce(jsonResult1)
        .mockResolvedValueOnce(jsonResult2);

      mockParser.parseBusSchedule.mockResolvedValueOnce(
        departureScheduleListMockResponse,
      );
      mockParser.parseBusSchedule.mockResolvedValueOnce(
        returnScheduleListMockResponse,
      );

      const result1 = await service.scheduleList(requestDto);
      const result2 = await service.scheduleList(requestDto2);
      const expectedXml =
        `<Sefer>\n` +
        `  <FirmaNo>${requestDto.companyNo}</FirmaNo>\n` +
        `  <KalkisNoktaID>${requestDto.departurePointId}</KalkisNoktaID>\n` +
        `  <VarisNoktaID>${requestDto.arrivalPointId}</VarisNoktaID>\n` +
        `  <Tarih>${requestDto.date}</Tarih>\n` +
        `  <AraNoktaGelsin>${requestDto.includeIntermediatePoints}</AraNoktaGelsin>\n` +
        `  <IslemTipi>${requestDto.operationType}</IslemTipi>\n` +
        `  <YolcuSayisi>1</YolcuSayisi>\n` +
        `  <Ip>${requestDto.ip}</Ip>\n` +
        `</Sefer>`;

      const expectedXml2 =
        `<Sefer>\n` +
        `  <FirmaNo>${requestDto2.companyNo}</FirmaNo>\n` +
        `  <KalkisNoktaID>${requestDto2.departurePointId}</KalkisNoktaID>\n` +
        `  <VarisNoktaID>${requestDto2.arrivalPointId}</VarisNoktaID>\n` +
        `  <Tarih>${requestDto2.date}</Tarih>\n` +
        `  <AraNoktaGelsin>${requestDto2.includeIntermediatePoints}</AraNoktaGelsin>\n` +
        `  <IslemTipi>${requestDto2.operationType}</IslemTipi>\n` +
        `  <YolcuSayisi>1</YolcuSayisi>\n` +
        `  <Ip>${requestDto2.ip}</Ip>\n` +
        `</Sefer>`;

      expect(runSpy).toHaveBeenCalledTimes(2);
      expect(runSpy).toHaveBeenNthCalledWith(1, expectedXml);
      expect(runSpy).toHaveBeenNthCalledWith(2, expectedXml2);

      const departureSchedulesAndFeatures =
        await result1.departureSchedulesAndFeatures;
      const returnSchedulesAndFeatures =
        await result2.departureSchedulesAndFeatures;

      expect(departureSchedulesAndFeatures).toEqual(
        departureScheduleListMockResponse,
      );
      expect(returnSchedulesAndFeatures).toEqual(
        returnScheduleListMockResponse,
      );
    });
  });

  // describe('BusSearch method', () => {
  //   it('should return seats situation and features of the relevant bus company', async () => {
  //     const requestDto: BusSearchRequestDto = {
  //       companyNo: '37',
  //       departurePointId: '84',
  //       arrivalPointId: '738',
  //       date: '2024-09-15',
  //       time: '1900-01-01T15:00:00.000Z',
  //       routeNumber: '3',
  //       operationType: 0,
  //       passengerCount: '1',
  //       tripTrackingNumber: '21115',
  //       ip: '127.0.0.1',
  //     };

  //     const mockXmlResponse = fs.readFileSync(
  //       path.resolve(
  //         __dirname,
  //         '../../../../../../fixtures/biletall/bus/bus-search.response.xml',
  //       ),
  //       'utf-8',
  //     );

  //     const runSpy = jest
  //       .spyOn(BiletAllService.prototype, 'run')
  //       .mockResolvedValueOnce(mockXmlResponse);
  //     mockParser.parseBusSearchResponse.mockResolvedValueOnce(
  //       busSearchMockResponse,
  //     );
  //     const result = await service.busSearch(requestDto);
  //     const expectedXml =
  //       `<Otobus>\n` +
  //       `  <FirmaNo>${requestDto.companyNo}</FirmaNo>\n` +
  //       `  <KalkisNoktaID>${requestDto.departurePointId}</KalkisNoktaID>\n` +
  //       `  <VarisNoktaID>${requestDto.arrivalPointId}</VarisNoktaID>\n` +
  //       `  <Tarih>${requestDto.date}</Tarih>\n` +
  //       `  <Saat>${requestDto.time}</Saat>\n` +
  //       `  <HatNo>${requestDto.routeNumber}</HatNo>\n` +
  //       `  <IslemTipi>${requestDto.operationType}</IslemTipi>\n` +
  //       `  <YolcuSayisi>${requestDto.passengerCount}</YolcuSayisi>\n` +
  //       `  <SeferTakipNo>${requestDto.tripTrackingNumber}</SeferTakipNo>\n` +
  //       `  <Ip>${requestDto.ip}</Ip>\n` +
  //       `</Otobus>`;

  //     expect(runSpy).toHaveBeenCalledWith(expectedXml);
  //     expect(mockParser.parseBusSearchResponse).toBeCalledWith(mockXmlResponse);
  //     expect(result).toStrictEqual(busSearchMockResponse);
  //   });
  // });

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

      const runSpy = jest
        .spyOn(BiletAllService.prototype, 'run')
        .mockResolvedValueOnce(mockXmlResponse);

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

      expect(runSpy).toHaveBeenCalledWith(expectedXml.trim());
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

      const runSpy = jest
        .spyOn(BiletAllService.prototype, 'run')
        .mockResolvedValueOnce(mockXmlResponse);
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

      expect(runSpy).toHaveBeenCalledWith(expectedXml);
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

      const runSpy = jest
        .spyOn(BiletAllService.prototype, 'run')
        .mockResolvedValueOnce(mockXmlResponse);
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

      expect(runSpy).toHaveBeenCalledWith(expectedXml.trim());
      expect(mockParser.parseServiceInformation).toBeCalledWith(
        mockXmlResponse,
      );
      expect(result).toStrictEqual(serviceInformationMockResponse);
    });
  });

  // describe('saleRequest  method', () => {
  //   it('should return ticket purchase transaction result', async () => {
  //     const requestDto: BusPurchaseDto = {
  //       companyNo: '37',
  //       departurePointId: 84,
  //       arrivalPointId: 738,
  //       date: '2024-08-06',
  //       time: '1900-01-01T02:30:00.000Z',
  //       routeNumber: 1,
  //       tripTrackingNumber: '20470',
  //       passengers: [
  //         {
  //           seatNo: 2,
  //           firstName: 'Bahyaddin',
  //           lastName: 'Nuri',
  //           fullName: 'Bahyaddin Nuri',
  //           gender: Gender.MALE,
  //           isTurkishCitizen: true,
  //           turkishIdNumber: '99766292460',
  //         },
  //       ],
  //       phoneNumber: '5550240045',
  //       totalTicketPrice: 40,
  //       webPassenger: {
  //         ip: '127.0.0.1',
  //         email: 'bahyeddin@gmail.com',
  //         prepaymentUsage: false,
  //         prepaymentAmount: '40.0000',
  //         creditCardNo: '5218076007402834',
  //         creditCardHolder: 'Bahyaddin Nuri',
  //         creditCardExpiryDate: '11/2040',
  //         creditCardCCV2: '820',
  //       },
  //     };

  //     const mockXmlResponse = fs.readFileSync(
  //       path.resolve(
  //         __dirname,
  //         '../../../../../../fixtures/biletall/bus/bus-purchase.response.xml',
  //       ),
  //       'utf-8',
  //     );

  //     const runSpy = jest
  //       .spyOn(BiletAllService.prototype, 'run')
  //       .mockResolvedValueOnce(mockXmlResponse);
  //     const result = await service.saleRequest(requestDto);
  //     const expectedXml = `
  // <IslemSatis>
  //   <FirmaNo>${requestDto.companyNo}</FirmaNo>
  //   <KalkisNoktaID>${requestDto.departurePointId}</KalkisNoktaID>
  //   <VarisNoktaID>${requestDto.arrivalPointId}</VarisNoktaID>
  //   <Tarih>${requestDto.date}</Tarih>
  //   <Saat>${requestDto.time}</Saat>
  //   <HatNo>${requestDto.routeNumber}</HatNo>
  //   <SeferNo>${requestDto.tripTrackingNumber}</SeferNo>
  //   <KalkisTerminalAdiSaatleri/>
  //   <KoltukNo1>${requestDto.passengers[0].seatNo}</KoltukNo1>
  //   <Adi1>${requestDto.passengers[0].firstName}</Adi1>
  //   <Soyadi1>${requestDto.passengers[0].lastName}</Soyadi1>
  //   <Cinsiyet1>${[
  //     requestDto.passengers[0].gender === 'male' ? 2 : 1,
  //   ]}</Cinsiyet1>
  //   <TcVatandasiMi1>${
  //     requestDto.passengers[0].isTurkishCitizen === true ? 1 : 0
  //   }</TcVatandasiMi1>
  //   <TcKimlikNo1>${requestDto.passengers[0].turkishIdNumber}</TcKimlikNo1>
  //   <PasaportUlkeKod1/>
  //   <PasaportNo1/>
  //   <TelefonNo>${requestDto.phoneNumber}</TelefonNo>
  //   <ToplamBiletFiyati>${requestDto.totalTicketPrice}</ToplamBiletFiyati>
  //   <YolcuSayisi>${requestDto.passengers.length}</YolcuSayisi>
  //   <BiletSeriNo>1</BiletSeriNo>
  //   <OdemeSekli>0</OdemeSekli>
  //   <FirmaAciklama/>
  //   <HatirlaticiNot/>
  //   <SeyahatTipi>0</SeyahatTipi>
  //   <WebYolcu>
  //     <WebUyeNo>0</WebUyeNo>
  //     <Ip>${requestDto.webPassenger.ip}</Ip>
  //     <Email>${requestDto.webPassenger.email}</Email>
  //     <KrediKartNo>${requestDto.webPassenger.creditCardNo}</KrediKartNo>
  //     <KrediKartSahip>${
  //       requestDto.webPassenger.creditCardHolder
  //     }</KrediKartSahip>
  //     <KrediKartGecerlilikTarihi>${
  //       requestDto.webPassenger.creditCardExpiryDate
  //     }</KrediKartGecerlilikTarihi>
  //     <KrediKartCCV2>${requestDto.webPassenger.creditCardCCV2}</KrediKartCCV2>
  //   </WebYolcu>
  // </IslemSatis>`;

  //     expect(mockTransactionRules).toHaveBeenCalledWith({
  //       companyNo: '37',
  //       departurePointId: '84',
  //       arrivalPointId: '738',
  //       date: '2024-08-06',
  //       time: '1900-01-01T02:30:00.000Z',
  //       routeNumber: '1',
  //       operationType: 0,
  //       passengerCount: '1',
  //       tripTrackingNumber: '20470',
  //       ip: '127.0.0.1',
  //     });
  //     expect(runSpy).toHaveBeenCalledWith(expectedXml.trim());
  //     expect(result).toStrictEqual(mockXmlResponse);
  //   });
  // });
});
