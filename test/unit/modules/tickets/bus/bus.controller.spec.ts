import { Gender } from '@app/common/enums';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { ConfigModule } from '@app/configs/config.module';
import { BusController } from '@app/modules/tickets/bus/bus.controller';
import { BoardingPointRequestDto } from '@app/modules/tickets/bus/dto/bus-boarding-point.dto';
import { BusCompanyRequestDto } from '@app/modules/tickets/bus/dto/bus-company.dto';
import { BusPurchaseDto } from '@app/modules/tickets/bus/dto/bus-purchase.dto';
import { BusRouteRequestDto } from '@app/modules/tickets/bus/dto/bus-route.dto';
import { BusScheduleRequestDto } from '@app/modules/tickets/bus/dto/bus-schedule-list.dto';
import { BusSearchRequestDto } from '@app/modules/tickets/bus/dto/bus-search.dto';
import { BusSeatAvailabilityRequestDto } from '@app/modules/tickets/bus/dto/bus-seat-availability.dto';
import { ServiceInformationRequestDto } from '@app/modules/tickets/bus/dto/bus-service-information.dto';
import { BiletAllParser } from '@app/modules/tickets/bus/services/biletall/biletall-bus.parser';
import { BiletAllBusService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';
import { BusService } from '@app/modules/tickets/bus/services/bus.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('BusController', () => {
  const busServiceMock = {
    getBusTerminalsByName: jest.fn(),
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
        BiletAllParser,
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

      const mockResponse = [
        {
          companyNumber: '37',
          companyName: 'İnci Turizm',
          companyLogo: 'https://eticket.ipektr.com/wsbos3/LogoVer.Aspx?fnum=37',
          emptyBranchCode: '32011',
          emptyUserCode: '32011',
          ticketSerialNumberTracking: '0',
          ticketSerialNumber: '0',
          website: 'http://eticket.ipektr.com/Firms_37/',
          phone: '0 352 444 44 38',
          soldSeatCount: '100',
          reservedSeatCount: '100',
          companyNumberStr: '37',
          maxSameMemberCardTransactionInBus: '255',
          canPerformMultiGenderTransaction: '1',
          cancellationPeriodUntilDepartureMinutes: '60',
          isTicketCancellationActive: '1',
          isOpenMoneyUsageActive: '1',
        },
      ];

      biletAllBusServiceMock.company.mockResolvedValueOnce(mockResponse);

      const result = await controller.company(requestDto);

      expect(biletAllBusService.company).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(mockResponse);
    });
  });

  describe('busTerminalsByName method', () => {
    it('should return bus terminals based on the name', async () => {
      const mockResponse = [
        {
          ID: '1640',
          SeyahatSehirID: '5',
          UlkeKodu: 'AL',
          Bolge: '',
          Ad: 'Tiran (Arnavutluk)',
          Aciklama: '',
          MerkezMi: '1',
          BagliOlduguNoktaID: '0',
          AramadaGorunsun: 'True',
        },
        {
          ID: '1404',
          SeyahatSehirID: '304',
          UlkeKodu: 'AZ',
          Bolge: '',
          Ad: 'Bakü (Azerbaycan)',
          Aciklama: '',
          MerkezMi: '1',
          BagliOlduguNoktaID: '0',
          AramadaGorunsun: 'True',
        },
      ];

      busServiceMock.getBusTerminalsByName.mockResolvedValueOnce(mockResponse);

      const queryDto = { name: 'Adana' };

      const result = await controller.busTerminalsByName(queryDto);

      expect(busServiceMock.getBusTerminalsByName).toBeCalledWith('Adana');
      expect(result).toStrictEqual(mockResponse);
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
        passengerCount: '1',
      };
      const mockResponse = {
        schedules: [
          {
            id: '1',
            timeOfDay: 'Gece',
            companyNumber: '37',
            companyName: 'İnci Turizm',
            localTime: '2024-09-20T22:00:00+03:00',
            localInternetTime: '2024-09-20T22:00:00+03:00',
            date: '2024-09-20T00:00:00+03:00',
            time: '1900-01-01T22:00:00+03:00',
            dayEnd: '0',
            routeNumber: '3',
            initialDeparturePlace: 'ANKARA',
            finalArrivalPlace: 'KAYSERİ',
            departurePlace: 'ANKARA',
            arrivalPlace: 'KAYSERİ',
            initialDeparturePointId: '84',
            initialDeparturePoint: 'Ankara (Aşti)',
            departurePointId: '84',
            departurePoint: 'Ankara (Aşti)',
            arrivalPointId: '738',
            arrivalPoint: 'Kayseri',
            finalArrivalPointId: '738',
            finalArrivalPoint: 'Kayseri',
            busType: 'TR15',
            busSeatArrangementType: '2+2',
            busTypeDescription: 'Travego 15 SHD',
            busPhone: '(536)-633-33-36',
            busPlate: '',
            travelDuration: '1900-01-01T05:00:00+03:00',
            travelDurationDisplayType: '1',
            approximateTravelDuration: '5-6',
            ticketPrice1: '40',
            internetTicketPrice: '40',
            classDifference: '0',
            maxReservationTime: '0',
            tripType: '',
            tripTypeDescription: 'MOLALI',
            routeTripNumber: '',
            busTypeClass: '0',
            tripTrackingNumber: '21202',
            totalSaleCount: '0',
            occupancyRuleExists: '0',
            busTypeFeature:
              '00000000000000000000000000000000000000000000000000',
            normalTicketPrice: '40',
            isFullTrip: '0',
            facilities: '',
            tripAvailableSeatCount: '46',
            departureTerminalName: '',
            departureTerminalNameTimes: '',
            maximumReserveDateTime: '2024-09-19T00:00:00+03:00',
            route: 'Ankara (Aşti) ->Kayseri ',
            isCardRequired: 'false',
            isTicketCancellationActive: '1',
            isOpenMoneyUsageActive: '1',
            cancellationPeriodUntilDepartureMinutes: '60',
            companyTripDescription: '',
            isSalesRedirected: '0',
            seatSelectionAvailable: 'true',
            tripCode: '',
          },
        ],
        features: [
          {
            typeFeature: '0',
            typeFeatureDescription: 'İnternet',
            typeFeatureDetail:
              'Sağladığımız internet bağlantısını bilgisayarınızda kullanabilirsiniz.',
            typeFeatureIcon: 'Internet.gif',
          },
          {
            typeFeature: '1',
            typeFeatureDescription: 'Rahat Koltuk',
            typeFeatureDetail: 'Bu araçta geniş ve rahat koltuk bulunmaktadır.',
            typeFeatureIcon: 'Rahat_Koltuk.gif',
          },
        ],
      };
      biletAllBusServiceMock.scheduleList.mockResolvedValueOnce(mockResponse);

      const result = await controller.scheduleList(requestDto);

      expect(biletAllBusService.scheduleList).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(mockResponse);
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
      const mockResponse = {
        trip: {
          localDateTime: '2024-09-15T15:00:00+03:00',
          internetDateTime: '2024-09-15T15:00:00+03:00',
          departureName: 'ANKARA',
          arrivalName: 'KAYSERİ',
          routeNumber: '3',
          priceChangeable: 'False',
          ticketPrice1: '40.00',
          ticketPrice2: '0.00',
          ticketPrice3: '0.00',
          internetTicketPrice: '40.00',
          classDifferenceTicketPrice: '0.00',
          singleSeatDifferenceTicketPrice: '0.00',
          guestTicketPrice: '0.01',
          sellsGuestTickets: 'false',
          sellsDiscountedTicketsForDisabled: 'false',
          sellsQuotaTickets: 'true',
          isReservationActive: 'true',
          isSaleActive: 'true',
          maximumReservationDateTime: '14.09.2024 15:00:00',
          busType: 'TR15',
          busTypeClass: '0',
          busTypeSecondFloorRow: '0',
          busPlate: '',
          busCaptainName: '',
          busHostessName: '',
          departureTime: '0',
          busTripMessage: '',
          busBranchMessage: '',
          platformNumber: '',
          departureTerminalName: '',
          nightDescription: 'Pazar',
          maximumEmptyFemaleSeats: '3',
          branchTicketPort: '1',
          totalPassengerPoints: '0',
          passengerPointsMultiplier: '1,0000',
          occupancyRateDiscountApplied: 'False',
          busTypeFeature: '00000000000000000000000000000000000000000000000000',
          backwardSeats: '',
          idNumberRequiredForBranchSale: '1',
          travelDuration: '1.01.1900 05:00:00',
          tripTypeDescription: 'MOLALI',
          busTypeDescription: 'Travego 15 SHD',
          companyBestPriceActive: '0',
          busMessage:
            '%3cfont+style%3d%27font-family%3aVerdana%3bfont-size%3a11px%3bfont-weight%3a700%3btext-decoration%3aunderline%2cfalse%3bcolor%3a%23333%3bmargin%3a1px%3b%27%3e%3cb%3e%c4%b0%c5%9fleminiz%2c+Kredi+Kart%c4%b1+Hesap+Ekstrenizde%3cbr%3e%5bB%c4%b0LETAL+%c4%b0%c3%87+VE+DI%c5%9e+T%c4%b0C%5d+olarak+g%c3%b6r%c3%bcnecektir.%3c%2fb%3e%3c%2ffont%3e',
          facilities: '',
          payment3DSecureActive: '1',
          payment3DSecureMandatory: '1',
          paypalUpperLimit: '500',
          maximumEmptyMaleSeats: '5',
          sellableSeatCount: '48',
          reservationCannotBeMadeReason: '',
          companyMaxTotalTicketPrice: '10000.0000',
          canProcessWithPassportNumber: '1',
          canSelectSeatsOfDifferentGenders: '1',
          busSeatLayout: '',
          busHESCodeMandatory: '0',
          doubleSeatCanBeSoldToSinglePassenger: '1',
          singleSeatsFullDoubleSeatsSalePossible: '1',
          approximateTravelDuration: '',
          travelDurationDisplayType: '1',
          canSelectSeatsWithDifferentPrices: '1',
          ticketCancellationActive: '1',
          openMoneyUsageActive: '1',
          cancellationTimeUntilDepartureMinutes: '60',
          departurePointID: '84',
          departurePoint: 'Ankara (Aşti)',
          arrivalPointID: '738',
          arrivalPoint: 'Kayseri',
        },
        seats: [
          {
            seatString: '01',
            seatNumber: '1',
            status: '0',
            adjacentStatus: '0',
            internetSeatPrice: '40',
          },
          {
            seatString: '02',
            seatNumber: '2',
            status: '0',
            adjacentStatus: '0',
            internetSeatPrice: '40',
          },
        ],
        travelTypes: [
          {
            travelType: '0',
            travelName: 'Normal',
            ticketPrice: '40',
            ticketPriceClassDifference: '0',
            singleSeatPriceDifference: '0',
          },
          {
            travelType: '1',
            travelName: 'Özürlü',
            ticketPrice: '0',
            ticketPriceClassDifference: '0',
            singleSeatPriceDifference: '0',
          },
        ],
        features: [
          {
            typeFeature: '0',
            typeFeatureDescription: 'İnternet',
            typeFeatureDetail:
              'Sağladığımız internet bağlantısını bilgisayarınızda kullanabilirsiniz.',
            typeFeatureIcon: 'Internet.gif',
          },
          {
            typeFeature: '1',
            typeFeatureDescription: 'Rahat Koltuk',
            typeFeatureDetail: 'Bu araçta geniş ve rahat koltuk bulunmaktadır.',
            typeFeatureIcon: 'Rahat_Koltuk.gif',
          },
        ],
        paymentRules: {
          payment3DSecureActive: true,
          payment3DSecureMandatory: true,
          openMoneyPaymentActive: true,
          prePaymentActive: true,
          parakodPaymentActive: false,
          bkmPaymentActive: false,
          paypalPaymentActive: false,
          paymentRulePaypalUpperLimit: '500',
          hopiActive: false,
          masterpassActive: false,
          fastPayPaymentActive: false,
          garantiPayPaymentActive: false,
        },
      };
      biletAllBusServiceMock.busSearch.mockResolvedValueOnce(mockResponse);

      const result = await controller.busSearch(requestDto);

      expect(biletAllBusService.busSearch).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(mockResponse);
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
      const mockResponse = {
        isAvailable: true,
      };
      biletAllBusServiceMock.busSeatAvailability.mockResolvedValueOnce(
        mockResponse,
      );

      const result = await controller.busSeatAvailability(requestDto);

      expect(biletAllBusService.busSeatAvailability).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(mockResponse);
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
      const mockResponse = {
        Table: [
          {
            Saat: '2018-12-10T02:30:00+03:00',
          },
          {
            Yer: '',
            Saat: '2018-12-10T02:30:00+03:00',
            Internette_Gozuksunmu: '0',
          },
          {
            Yer: 'BELSİN GİRİŞ',
            Saat: '2018-12-10T02:30:00+03:00',
            Internette_Gozuksunmu: '1',
          },
          {
            Yer: 'FUZULİ',
            Saat: '2018-12-10T02:30:00+03:00',
            Internette_Gozuksunmu: '1',
          },
          {
            Yer: 'HIMMETD SHEL',
            Saat: '2018-12-10T02:30:00+03:00',
            Internette_Gozuksunmu: '1',
          },
          {
            Yer: 'TOYOTA',
            Saat: '2018-12-10T02:30:00+03:00',
            Internette_Gozuksunmu: '1',
          },
          {
            Yer: 'AĞAÇ İŞLERİ',
            Saat: '2018-12-10T02:40:00+03:00',
            Internette_Gozuksunmu: '1',
          },
        ],
      };
      biletAllBusServiceMock.boardingPoint.mockResolvedValueOnce(mockResponse);

      const result = await controller.boardingPoint(requestDto);

      expect(biletAllBusService.boardingPoint).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(mockResponse);
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
      const mockResponse = {
        Table: [
          {
            Yer: 'ANAYURT 2',
            Saat: '2018-12-10T15:47:00+03:00',
            Internette_Gozuksunmu: '1',
          },
        ],
      };
      biletAllBusServiceMock.serviceInformation.mockResolvedValueOnce(
        mockResponse,
      );

      const result = await controller.serviceInformation(requestDto);

      expect(biletAllBusService.serviceInformation).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(mockResponse);
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
      const mockResponse = {
        Table1: [
          {
            VarisYeri: 'ANKARA',
            SiraNo: '3',
            KalkisTarihSaat: '1900-01-01T00:00:00+03:00',
            VarisTarihSaat: '2024-08-05T18:00:00+03:00',
            KaraNoktaID: '84',
            KaraNoktaAd: 'Ankara (Aşti)',
          },
          {
            VarisYeri: 'KIRIKKALE',
            SiraNo: '4',
            KalkisTarihSaat: '1900-01-01T00:00:00+03:00',
            VarisTarihSaat: '2024-08-05T19:00:00+03:00',
            KaraNoktaID: '1275',
            KaraNoktaAd: 'Kırıkkale',
          },
        ],
      };
      biletAllBusServiceMock.getRoute.mockResolvedValueOnce(mockResponse);

      const result = await controller.getRoute(requestDto);

      expect(biletAllBusService.getRoute).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(mockResponse);
    });
  });

  describe('saleRequest method', () => {
    it('should return route of the relevant expedition', async () => {
      const requestDto: BusPurchaseDto = {
        companyNo: '37',
        departurePointId: 84,
        arrivalPointId: 738,
        date: '2024-08-06',
        time: '1900-01-01T02:30:00.000Z',
        routeNumber: 1,
        tripTrackingNumber: '20470',
        passengers: [
          {
            seatNo: 2,
            firstName: 'Bahyaddin',
            lastName: 'Nuri',
            fullName: 'Bahyaddin Nuri',
            gender: Gender.MALE,
            isTurkishCitizen: true,
            turkishIdNumber: '99766292460',
          },
        ],
        phoneNumber: '5550240045',
        totalTicketPrice: 40,
        webPassenger: {
          ip: '127.0.0.1',
          email: 'bahyeddin@gmail.com',
          prepaymentUsage: false,
          prepaymentAmount: '40.0000',
          creditCardNo: '5218076007402834',
          creditCardHolder: 'Bahyaddin Nuri',
          creditCardExpiryDate: '11/2040',
          creditCardCCV2: '820',
        },
      };

      const mockResponse = {
        IslemSonuc: {
          Sonuc: 'true',
          PNR: 'GC03037',
          Mesaj: '',
          SeferInternetTarihSaat: '2018-12-10T02:30:00',
          Ebilet1: '037011459532',
        },
      };

      biletAllBusServiceMock.saleRequest.mockResolvedValueOnce(mockResponse);

      const result = await controller.saleRequest(requestDto);

      expect(biletAllBusService.saleRequest).toBeCalledWith(requestDto);
      expect(result).toStrictEqual(mockResponse);
    });
  });
});
