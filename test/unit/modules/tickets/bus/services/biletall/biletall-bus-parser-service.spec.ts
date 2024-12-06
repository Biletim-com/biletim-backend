import * as fs from 'fs';
import * as path from 'path';

import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { parseStringPromise } from 'xml2js';

import { BusController } from '@app/modules/tickets/bus/bus.controller';
import { BusTerminalRepository } from '@app/modules/tickets/bus/repositories/bus-terminal.repository';

// services
import { BiletAllParserService } from '@app/providers/ticket/biletall/services/biletall-response-parser.service';
import { BiletAllBusSearchParserService } from '@app/providers/ticket/biletall/bus/parsers/biletall-bus-search.parser.service';
import { BiletAllBusSearchService } from '@app/providers/ticket/biletall/bus/services/biletall-bus-search.service';
import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { BusTerminalsService } from '@app/modules/tickets/bus/services/bus-terminals.service';

import {
  boardingPointMockResponse,
  busCompanyMockResponse,
  busSeatAvailabilityMockResponse,
  departureScheduleListMockResponse,
  getBusTerminalsByNameMockResponse,
  getRouteMockResponse,
  serviceInformationMockResponse,
} from '../../mock-response/biletall-bus-service-mock-response';

// errors
import { BiletAllResponseError } from '@app/providers/ticket/biletall/errors/biletall-response.error';

// types
import { SoapEnvelope } from '@app/providers/ticket/biletall/types/biletall-soap-envelope.type';
import { BusCompaniesResponse } from '@app/providers/ticket/biletall/bus/types/biletall-bus-company.type';
import { BusTerminalPointResponse } from '@app/providers/ticket/biletall/bus/types/biletall-bus-terminal.type';
import { BusResponse } from '@app/providers/ticket/biletall/bus/types/biletall-bus-search.type';
import { BusSeatAvailabilityResponse } from '@app/providers/ticket/biletall/bus/types/biletall-bus-seat-availability.type';
import { BusBoardingPointResponse } from '@app/providers/ticket/biletall/bus/types/biletall-bus-boarding-point.type';
import { BusServiceInformationResponse } from '@app/providers/ticket/biletall/bus/types/biletall-bus-service-information.type';
import { BusRouteDetailResponse } from '@app/providers/ticket/biletall/bus/types/biletall-bus-route.type';
import { BusTripScheduleAndFeaturesResponse } from '@app/providers/ticket/biletall/bus/types/biletall-bus-trip-schedule.type';

describe('BiletAllBusParserService', () => {
  const mockBiletAllParserService = {
    extractResult: jest.fn(),
  };
  let parser: BiletAllBusSearchParserService;
  let mockDataSource: Partial<DataSource>;

  beforeEach(async () => {
    mockDataSource = {
      createEntityManager: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        BiletAllBusSearchParserService,
        BiletAllBusSearchService,
        BiletAllApiConfigService,
        BusTerminalsService,
        BusTerminalRepository,
        { provide: BiletAllParserService, useValue: mockBiletAllParserService },
        { provide: DataSource, useValue: mockDataSource },
      ],
      controllers: [BusController],
    }).compile();

    parser = module.get<BiletAllBusSearchParserService>(
      BiletAllBusSearchParserService,
    );
  });

  it('should be defined', () => {
    expect(parser).toBeDefined();
  });

  describe('parseCompany method', () => {
    it('should return expected company data as json', async () => {
      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/get-company.response.xml',
        ),
        'utf-8',
      );
      const jsonMockResponse: BusCompaniesResponse = await parseStringPromise(
        mockXmlResponse,
      );
      mockBiletAllParserService.extractResult.mockReturnValue({
        NewDataSet: [{ $: [Object], 'xs:schema': [Array], Table: [Array] }],
      });
      const result = parser.parseCompany(jsonMockResponse);

      expect(result).toEqual(busCompanyMockResponse);
    });

    it('should throw BiletAllResponseError if error exists in response', async () => {
      const mockErrorResponse: SoapEnvelope<null> = {
        'soap:Envelope': {
          'soap:Body': [
            {
              XmlIsletResponse: [
                {
                  XmlIsletResult: [
                    {
                      IslemSonuc: [
                        {
                          Sonuc: ['Error'],
                          Hata: ['An error occurred during the request.'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      mockBiletAllParserService.extractResult.mockImplementation(() => {
        throw new BiletAllResponseError('Some error occurred');
      });

      expect(() => {
        parser.parseCompany(mockErrorResponse);
      }).toThrow(BiletAllResponseError);
    });
  });

  describe('parseBusTerminals method', () => {
    it('should return all bus terminals as json', async () => {
      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/bus-get-terminals.response.xml',
        ),
        'utf-8',
      );
      const jsonMockResponse: BusTerminalPointResponse =
        await parseStringPromise(mockXmlResponse);
      mockBiletAllParserService.extractResult.mockReturnValue({
        NewDataSet: [{ $: [Object], 'xs:schema': [Array], Table: [Array] }],
      });
      const result = parser.parseBusTerminals(jsonMockResponse);

      expect(result).toEqual(getBusTerminalsByNameMockResponse);
    });

    it('should throw BiletAllResponseError if error exists in response', async () => {
      const mockErrorResponse: SoapEnvelope<null> = {
        'soap:Envelope': {
          'soap:Body': [
            {
              XmlIsletResponse: [
                {
                  XmlIsletResult: [
                    {
                      IslemSonuc: [
                        {
                          Sonuc: ['Error'],
                          Hata: ['An error occurred during the request.'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      mockBiletAllParserService.extractResult.mockImplementation(() => {
        throw new BiletAllResponseError('Some error occurred');
      });

      expect(() => {
        parser.parseBusTerminals(mockErrorResponse);
      }).toThrow(BiletAllResponseError);
    });
  });

  describe('parseBusSchedule method', () => {
    it('should return schedule list and feature of flights data  as json', async () => {
      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/schedule-list.response.xml',
        ),
        'utf-8',
      );
      const jsonMockResponse: BusTripScheduleAndFeaturesResponse =
        await parseStringPromise(mockXmlResponse);
      mockBiletAllParserService.extractResult.mockReturnValue({
        NewDataSet: [{ $: [Object], 'xs:schema': [Array], Table: [Array] }],
      });
      const result = parser.parseTripSchedule(jsonMockResponse);

      expect(result).toBeDefined();
      expect(result.schedulesAndFeatures).toBeDefined();
      expect(result.schedulesAndFeatures).toHaveLength(
        departureScheduleListMockResponse.departureSchedulesAndFeatures
          .schedulesAndFeatures.length,
      );
    });

    it('should throw BiletAllResponseError if error exists in response', async () => {
      const mockErrorResponse: SoapEnvelope<null> = {
        'soap:Envelope': {
          'soap:Body': [
            {
              XmlIsletResponse: [
                {
                  XmlIsletResult: [
                    {
                      IslemSonuc: [
                        {
                          Sonuc: ['Error'],
                          Hata: ['An error occurred during the request.'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      mockBiletAllParserService.extractResult.mockImplementation(() => {
        throw new BiletAllResponseError('Some error occurred');
      });

      expect(() => {
        parser.parseTripSchedule(mockErrorResponse);
      }).toThrow(BiletAllResponseError);
    });
  });

  describe('parseBusSearchResponse method', () => {
    it('should return seats situation and features of the relevant bus company as json', async () => {
      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/bus-search.response.xml',
        ),
        'utf-8',
      );
      const jsonMockResponse: BusResponse = await parseStringPromise(
        mockXmlResponse,
      );
      mockBiletAllParserService.extractResult.mockReturnValue({
        NewDataSet: [{ $: [Object], 'xs:schema': [Array], Table: [Array] }],
      });
      const result = parser.parseBusDetails(jsonMockResponse);

      expect(result).toHaveProperty('bus');

      expect(result).toHaveProperty('seats');
      expect(Array.isArray(result.seats)).toBe(true);
      expect(result.seats.length).toBeGreaterThan(0);

      expect(result).toHaveProperty('travelTypes');
      expect(Array.isArray(result.travelTypes)).toBe(true);
      expect(result.travelTypes.length).toBeGreaterThan(0);

      expect(result).toHaveProperty('paymentRules');
    });

    it('should throw BiletAllResponseError if error exists in response', async () => {
      const mockErrorResponse: SoapEnvelope<null> = {
        'soap:Envelope': {
          'soap:Body': [
            {
              XmlIsletResponse: [
                {
                  XmlIsletResult: [
                    {
                      IslemSonuc: [
                        {
                          Sonuc: ['Error'],
                          Hata: ['An error occurred during the request.'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      mockBiletAllParserService.extractResult.mockImplementation(() => {
        throw new BiletAllResponseError('Some error occurred');
      });

      expect(() => {
        parser.parseBusDetails(mockErrorResponse);
      }).toThrow(BiletAllResponseError);
    });
  });

  describe('parseBusSeatAvailability method', () => {
    it('should return status of the company seat as json', async () => {
      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/bus-seat-availability.response.xml',
        ),
        'utf-8',
      );
      const jsonMockResponse: BusSeatAvailabilityResponse =
        await parseStringPromise(mockXmlResponse);
      mockBiletAllParserService.extractResult.mockReturnValue({
        NewDataSet: [{ $: [Object], 'xs:schema': [Array], Table: [Array] }],
      });
      const result = parser.parseBusSeatAvailability(jsonMockResponse);

      expect(result).toEqual(busSeatAvailabilityMockResponse);
    });

    it('should throw BiletAllResponseError if error exists in response', async () => {
      const mockErrorResponse: SoapEnvelope<null> = {
        'soap:Envelope': {
          'soap:Body': [
            {
              XmlIsletResponse: [
                {
                  XmlIsletResult: [
                    {
                      IslemSonuc: [
                        {
                          Sonuc: ['Error'],
                          Hata: ['An error occurred during the request.'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      mockBiletAllParserService.extractResult.mockImplementation(() => {
        throw new BiletAllResponseError('Some error occurred');
      });

      expect(() => {
        parser.parseBusSeatAvailability(mockErrorResponse);
      }).toThrow(BiletAllResponseError);
    });
  });

  describe('parseBoardingPoint method', () => {
    it('should return boarding point and time of the relevant expedition as json', async () => {
      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/bus-boarding-point.response.xml',
        ),
        'utf-8',
      );
      const jsonMockResponse: BusBoardingPointResponse =
        await parseStringPromise(mockXmlResponse);
      mockBiletAllParserService.extractResult.mockReturnValue({
        NewDataSet: [{ $: [Object], 'xs:schema': [Array], Table: [Array] }],
      });
      const result = parser.parseBoardingPoint(jsonMockResponse);

      expect(result).toEqual(boardingPointMockResponse);
    });

    it('should throw BiletAllResponseError if error exists in response', async () => {
      const mockErrorResponse: SoapEnvelope<null> = {
        'soap:Envelope': {
          'soap:Body': [
            {
              XmlIsletResponse: [
                {
                  XmlIsletResult: [
                    {
                      IslemSonuc: [
                        {
                          Sonuc: ['Error'],
                          Hata: ['An error occurred during the request.'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      mockBiletAllParserService.extractResult.mockImplementation(() => {
        throw new BiletAllResponseError('Some error occurred');
      });

      expect(() => {
        parser.parseBoardingPoint(mockErrorResponse);
      }).toThrow(BiletAllResponseError);
    });
  });

  describe('parseServiceInformation method', () => {
    it('should return  service information of the relevant expedition as json', async () => {
      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/bus-service-information.response.xml',
        ),
        'utf-8',
      );
      const jsonMockResponse: BusServiceInformationResponse =
        await parseStringPromise(mockXmlResponse);
      mockBiletAllParserService.extractResult.mockReturnValue({
        NewDataSet: [{ $: [Object], 'xs:schema': [Array], Table: [Array] }],
      });
      const result = parser.parseServiceInformation(jsonMockResponse);

      expect(result).toEqual(serviceInformationMockResponse);
    });

    it('should throw BiletAllResponseError if error exists in response', async () => {
      const mockErrorResponse: SoapEnvelope<null> = {
        'soap:Envelope': {
          'soap:Body': [
            {
              XmlIsletResponse: [
                {
                  XmlIsletResult: [
                    {
                      IslemSonuc: [
                        {
                          Sonuc: ['Error'],
                          Hata: ['An error occurred during the request.'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      mockBiletAllParserService.extractResult.mockImplementation(() => {
        throw new BiletAllResponseError('Some error occurred');
      });

      expect(() => {
        parser.parseServiceInformation(mockErrorResponse);
      }).toThrow(BiletAllResponseError);
    });
  });

  describe('parseRouteDetail method', () => {
    it('should return  route information of the relevant expedition as json', async () => {
      const mockXmlResponse = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../../../../fixtures/biletall/bus/bus-get-route.response.xml',
        ),
        'utf-8',
      );
      const jsonMockResponse: BusRouteDetailResponse = await parseStringPromise(
        mockXmlResponse,
      );
      mockBiletAllParserService.extractResult.mockReturnValue({
        NewDataSet: [{ $: [Object], 'xs:schema': [Array], Table: [Array] }],
      });
      const result = parser.parseRouteDetail(jsonMockResponse);

      expect(result).toEqual(getRouteMockResponse);
    });

    it('should throw BiletAllResponseError if error exists in response', async () => {
      const mockErrorResponse: SoapEnvelope<null> = {
        'soap:Envelope': {
          'soap:Body': [
            {
              XmlIsletResponse: [
                {
                  XmlIsletResult: [
                    {
                      IslemSonuc: [
                        {
                          Sonuc: ['Error'],
                          Hata: ['An error occurred during the request.'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      mockBiletAllParserService.extractResult.mockImplementation(() => {
        throw new BiletAllResponseError('Some error occurred');
      });

      expect(() => {
        parser.parseRouteDetail(mockErrorResponse);
      }).toThrow(BiletAllResponseError);
    });
  });
});
