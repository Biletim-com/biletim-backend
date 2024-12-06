import { Test, TestingModule } from '@nestjs/testing';
import { Gender } from '@app/common/enums';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { ConfigModule } from '@app/configs/config.module';
import { BusController } from '@app/modules/tickets/bus/bus.controller';
import { BoardingPointRequestDto } from '@app/providers/ticket/biletall/bus/dto/bus-boarding-point.dto';
import { BusCompanyRequestDto } from '@app/modules/tickets/bus/dto/bus-company.dto';
import { BusScheduleRequestDto } from '@app/modules/tickets/bus/dto/bus-schedule-list.dto';
import { BusSeatAvailabilityRequestDto } from '@app/modules/tickets/bus/dto/bus-seat-availability.dto';
import { ServiceInformationRequestDto } from '@app/providers/ticket/biletall/bus/dto/bus-service-information.dto';
import { BiletAllBusSearchParserService } from '@app/providers/ticket/biletall/bus/parsers/biletall-bus-search.parser.service';
import { BiletAllBusSearchService } from '@app/providers/ticket/biletall/bus/services/biletall-bus-search.service';
import { BusTerminalsService } from '@app/modules/tickets/bus/services/bus-terminals.service';
import {
  boardingPointMockResponse,
  busCompanyMockResponse,
  busSeatAvailabilityMockResponse,
  departureScheduleListMockResponse,
  getBusTerminalsByNameMockResponse,
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
  let biletAllBusService: BiletAllBusSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        BiletAllBusSearchParserService,
        BiletAllBusSearchService,
        BiletAllApiConfigService,
        {
          provide: BusTerminalsService,
          useValue: busServiceMock,
        },
        {
          provide: BiletAllBusSearchService,
          useValue: biletAllBusServiceMock,
        },
      ],
      controllers: [BusController],
    }).compile();

    controller = module.get<BusController>(BusController);
    biletAllBusService = module.get<BiletAllBusSearchService>(
      BiletAllBusSearchService,
    );
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  describe('company method', () => {
    it('should return expected company data', async () => {
      const requestDto: BusCompanyRequestDto = { companyNumber: '2' };

      biletAllBusServiceMock.company.mockResolvedValueOnce(
        busCompanyMockResponse,
      );

      const result = await controller.company(requestDto);

      expect(biletAllBusService.companies).toBeCalledWith(requestDto);
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
        companyNumber: '37',
        departurePointId: '84',
        arrivalPointId: '738',
        date: '2024-10-15',
      };

      const clientIp = '127.0.0.1';

      biletAllBusServiceMock.scheduleList.mockResolvedValueOnce(
        departureScheduleListMockResponse,
      );

      const result = await controller.scheduleList(clientIp, requestDto);

      expect(biletAllBusService.searchTripSchedules).toBeCalledWith(requestDto);
      expect(result).toEqual(departureScheduleListMockResponse);
    });
  });

  // describe('busSearch method', () => {
  //   it('should return relevant bus schedules and information', async () => {
  //     const requestDto: BusSearchRequestDto = {
  //       companyNumber: '37',
  //       departurePointId: '84',
  //       arrivalPointId: '738',
  //       date: '2024-09-15',
  //       time: '1900-01-01T15:00:00.000Z',
  //       routeNumber: '3',
  //       passengerCount: '1',
  //       tripTrackingNumber: '21115',
  //       ip: '127.0.0.1',
  //     };

  //     biletAllBusServiceMock.busSearch.mockResolvedValueOnce(
  //       busSearchMockResponse,
  //     );

  //     const result = await controller.busSearch(requestDto);

  //     expect(biletAllBusService.busSearch).toBeCalledWith(requestDto);
  //     expect(result).toStrictEqual(busSearchMockResponse);
  //   });
  // });

  describe('busSeatAvailability method', () => {
    it('should return availability of the relevant seat', async () => {
      const requestDto: BusSeatAvailabilityRequestDto =
        new BusSeatAvailabilityRequestDto({
          companyNumber: '37',
          departurePointId: '84',
          arrivalPointId: '738',
          travelStartDateTime: '2024-09-20T22:00:00.000Z',
          routeNumber: '3',
          tripTrackingNumber: '21202',
          seats: [
            {
              seatNumber: '1',
              gender: Gender.MALE,
            },
          ],
        });

      const clientIp = '127.0.0.1';

      biletAllBusServiceMock.busSeatAvailability.mockResolvedValueOnce(
        busSeatAvailabilityMockResponse,
      );

      const result = await controller.busSeatAvailability(clientIp, requestDto);

      expect(biletAllBusService.busSeatAvailability).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(busSeatAvailabilityMockResponse);
    });
  });

  // describe('saleRequest method', () => {
  //   it('should return route of the relevant expedition', async () => {
  //     const requestDto: BusPurchaseDto = {
  //       companyNumber: '37',
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
