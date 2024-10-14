import { Gender } from '@app/common/enums';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { ConfigModule } from '@app/configs/config.module';
import { BusController } from '@app/modules/tickets/bus/bus.controller';
import { BoardingPointRequestDto } from '@app/modules/tickets/bus/dto/bus-boarding-point.dto';
import { BusCompanyRequestDto } from '@app/modules/tickets/bus/dto/bus-company.dto';
// import { BusPurchaseDto } from '@app/modules/tickets/bus/dto/bus-purchase.dto';
import { BusRouteRequestDto } from '@app/modules/tickets/bus/dto/bus-route.dto';
import { BusScheduleRequestDto } from '@app/modules/tickets/bus/dto/bus-schedule-list.dto';
import { BusSearchRequestDto } from '@app/modules/tickets/bus/dto/bus-search.dto';
import { BusSeatAvailabilityRequestDto } from '@app/modules/tickets/bus/dto/bus-seat-availability.dto';
import { ServiceInformationRequestDto } from '@app/modules/tickets/bus/dto/bus-service-information.dto';
import { BiletAllBusParserService } from '@app/modules/tickets/bus/services/biletall/biletall-bus-parser.service';
import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';
import { BusService } from '@app/modules/tickets/bus/services/bus.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  boardingPointMockResponse,
  busCompanyMockResponse,
  busSearchMockResponse,
  busSeatAvailabilityMockResponse,
  departureScheduleListMockResponse,
  getBusTerminalsByNameMockResponse,
  getRouteMockResponse,
  // saleRequestMockResponse,
  serviceInformationMockResponse,
} from './mock-response/biletall-bus-service-mock-response';

describe('BusController', () => {
  const busServiceMock = {
    searchBusTerminals: jest.fn(),
  };

  const biletAllBusServiceMock = {
    company: jest.fn(),
    scheduleList: jest.fn(),
    busSearch: jest.fn(),
    busSeatAvailability: jest.fn(),
    boardingPoint: jest.fn(),
    serviceInformation: jest.fn(),
    getRoute: jest.fn(),
    saleRequest: jest.fn(),
  };

  let controller: BusController;
  let biletAllBusService: BiletAllBusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        BiletAllBusParserService,
        BiletAllBusService,
        BiletAllApiConfigService,
        {
          provide: BusService,
          useValue: busServiceMock,
        },
        {
          provide: BiletAllBusService,
          useValue: biletAllBusServiceMock,
        },
      ],
      controllers: [BusController],
    }).compile();

    controller = module.get<BusController>(BusController);
    biletAllBusService = module.get<BiletAllBusService>(BiletAllBusService);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  describe('company method', () => {
    it('should return expected company data', async () => {
      const requestDto: BusCompanyRequestDto = { companyNo: '2' };

      biletAllBusServiceMock.company.mockResolvedValueOnce(
        busCompanyMockResponse,
      );

      const result = await controller.company(requestDto);

      expect(biletAllBusService.company).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(busCompanyMockResponse);
    });
  });

  describe('busTerminalsByName method', () => {
    it('should return bus terminals based on the name', async () => {
      busServiceMock.searchBusTerminals.mockResolvedValueOnce(
        getBusTerminalsByNameMockResponse,
      );

      const queryDto = { searchTerm: 'Adana' };
      const result = await controller.searchBusTerminals(queryDto);

      expect(busServiceMock.searchBusTerminals).toBeCalledWith('Adana');
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
        ip: '127.0.0.1',
      };

      biletAllBusServiceMock.scheduleList.mockResolvedValueOnce(
        departureScheduleListMockResponse,
      );

      const result = await controller.scheduleList(requestDto);

      expect(biletAllBusService.scheduleList).toBeCalledWith(requestDto);
      expect(result).toEqual(departureScheduleListMockResponse);
    });
  });

  describe('busSearch method', () => {
    it('should return relevant bus schedules and information', async () => {
      const requestDto: BusSearchRequestDto = {
        companyNo: '37',
        departurePointId: '84',
        arrivalPointId: '738',
        date: '2024-09-15',
        time: '1900-01-01T15:00:00.000Z',
        routeNumber: '3',
        passengerCount: '1',
        tripTrackingNumber: '21115',
        ip: '127.0.0.1',
      };

      biletAllBusServiceMock.busSearch.mockResolvedValueOnce(
        busSearchMockResponse,
      );

      const result = await controller.busSearch(requestDto);

      expect(biletAllBusService.busSearch).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(busSearchMockResponse);
    });
  });

  describe('busSeatAvailability method', () => {
    it('should return availability of the relevant seat', async () => {
      const requestDto: BusSeatAvailabilityRequestDto = {
        companyNo: '37',
        departurePointId: '84',
        arrivalPointId: '738',
        date: '2024-09-20',
        time: '1900-01-01T22:00:00.000Z',
        routeNumber: '3',
        tripTrackingNumber: '21202',
        ip: '127.0.0.1',
        seats: [
          {
            seatNumber: '1',
            gender: Gender.MALE,
          },
        ],
      };

      biletAllBusServiceMock.busSeatAvailability.mockResolvedValueOnce(
        busSeatAvailabilityMockResponse,
      );

      const result = await controller.busSeatAvailability(requestDto);

      expect(biletAllBusService.busSeatAvailability).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(busSeatAvailabilityMockResponse);
    });
  });

  describe('boardingPoint method', () => {
    it('should return boarding location information of the relevant expedition', async () => {
      const requestDto: BoardingPointRequestDto = {
        companyNo: '37',
        departurePointID: '738',
        localTime: '2024-09-25T03:00:00+03:00',
        routeNumber: '6',
      };

      biletAllBusServiceMock.boardingPoint.mockResolvedValueOnce(
        boardingPointMockResponse,
      );

      const result = await controller.boardingPoint(requestDto);

      expect(biletAllBusService.boardingPoint).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(boardingPointMockResponse);
    });
  });

  describe('serviceInformation method', () => {
    it('should return service location  and time of the relevant expedition', async () => {
      const requestDto: ServiceInformationRequestDto = {
        companyNo: '37',
        departurePointID: '84',
        localTime: '2018-12-10T02:30:00',
        routeNumber: '1',
        date: '2079-06-06T01:00:00.000Z',
        time: '1900-01-01T00:00:00.000Z',
      };

      biletAllBusServiceMock.serviceInformation.mockResolvedValueOnce(
        serviceInformationMockResponse,
      );

      const result = await controller.serviceInformation(requestDto);

      expect(biletAllBusService.serviceInformation).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(serviceInformationMockResponse);
    });
  });

  describe('getRoute method', () => {
    it('should return route of the relevant expedition', async () => {
      const requestDto: BusRouteRequestDto = {
        companyNo: '37',
        routeNumber: '3',
        departurePointId: '84',
        arrivalPointId: '738',
        infoTechnologyName: 'GuzergahVerSaatli',
        tripTrackingNumber: '20454',
        date: '2024-08-05',
      };

      biletAllBusServiceMock.getRoute.mockResolvedValueOnce(
        getRouteMockResponse,
      );

      const result = await controller.getRoute(requestDto);

      expect(biletAllBusService.getRoute).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(getRouteMockResponse);
    });
  });

  // describe('saleRequest method', () => {
  //   it('should return route of the relevant expedition', async () => {
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

  //     biletAllBusServiceMock.saleRequest.mockResolvedValueOnce(
  //       saleRequestMockResponse,
  //     );

  //     const result = await controller.saleRequest(requestDto);

  //     expect(biletAllBusService.saleRequest).toBeCalledWith(requestDto);
  //     expect(result).toStrictEqual(saleRequestMockResponse);
  //   });
  // });
});
