import { Injectable } from '@nestjs/common';

import { BiletAllParserService } from '@app/common/services';

// dto
import { PlaneAirportDto } from '../../dto/plane-airport.dto';
import {
  DomesticFlightScheduleDto,
  DomesticFlightSegmentDto,
  FlightOptionDto,
  OptionFareDetailDto,
  OptionFareDto,
  SegmentClassDto,
} from '../../dto/plane-domestic-flight-schedule.dto';
import { ObjectTyped } from '@app/common/utils/object-typed.util';
import {
  AbroadFlightOptionDto,
  AbroadFlightScheduleDto,
  AbroadFlightSegmentDto,
} from '../../dto/plane-abroad-flight-schedule.dto';
import {
  PlaneAdditionalServiceRuleDto,
  PlaneBaggageInfoDto,
  PlanePaymentRulesDto,
  PlanePullPriceFlightDto,
  PriceListDto,
} from '../../dto/plane-pull-price-flight.dto';
import { PlanePassengerAgeRuleDto } from '../../dto/plane-company-passenger-age-rule.dto';
import { FlightTicketReservationDto } from '../../dto/plane-ticket-reservation.dto';
import { FlightTicketPurchaseDto } from '../../dto/plane-ticket-purchase.dto';

// types
import {
  PlaneAirport,
  PlaneAirportResponse,
} from './types/biletall-plane-airport.type';
import {
  FlightTicketPurchaseResult,
  PlaneTicketPurchaseResponse,
} from './types/biletall-plane-ticket-purchase.type';
import {
  FlightTicketReservationResult,
  PlaneTicketReservationResponse,
} from './types/biletall-plane-ticket-reservation.type';
import {
  AdditionalServiceRule,
  BaggageInfo,
  PaymentRules,
  PlanePrices,
  PlanePullPriceResponse,
} from './types/biletall-plane-pull-price-flight.type';
import {
  PlanePassengerAgeRule,
  PlanePassengerAgeRulesResponse,
} from './types/plane-biletall-company-passanger-age-rules.type';
import {
  AbroadFlightOption,
  AbroadFlightResponse,
  AbroadFlightSegment,
} from './types/biletall-plane-abroad-flight-schedule.type';
import {
  DomesticFlightResponse,
  FlightOption,
  FlightSegment,
  OptionFare,
  OptionFareDetail,
  SegmentClass,
} from './types/biletall-plane-domistic-flight-schedule.type';
import {
  BaggageAllowance,
  PassengerTypeFareInfo,
  PriceOfPiece,
  pullAbroadFlightPricePackagesResponse,
} from './types/biletall-plane-pull-abroad-flight-price-packages.type';
import {
  BrandFareInfoDto,
  BrandImportantNoteDto,
  BrandInfoDto,
  BrandPriceInfoDto,
  BrandSegmentInfoDto,
  BrandServiceDto,
  BrandServiceInfoDto,
  PassengerTypeFareInfoDto,
} from '../../dto/plane-pull-abroad-flight-price-packages.dto';
//import { FlightClassType } from '@app/common/enums';

@Injectable()
export class BiletAllPlaneParserService extends BiletAllParserService {
  public parseAirport = (response: PlaneAirportResponse): PlaneAirportDto[] => {
    const extractedResult = this.extractResult(response);
    const airports = extractedResult['HavaNoktalar'][0];
    const airportList = airports['HavaNokta'];

    return airportList.map((entry) => {
      const airportParsed: PlaneAirport = Object.assign({});
      for (const [key, [value]] of Object.entries(entry)) {
        airportParsed[key] = value;
      }
      return new PlaneAirportDto(airportParsed);
    });
  };

  public parseDomesticFlightResponse = (
    response: DomesticFlightResponse,
  ): DomesticFlightScheduleDto => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const flightOptionsDataSet = newDataSet['Secenekler'] ?? [];
    const flightOptionsMap = new Map<string, FlightOptionDto>();

    flightOptionsDataSet.forEach((entry) => {
      const flightOptionParsed: FlightOption = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightOptionParsed[key] = value;
      }
      const flightOptionDto = new FlightOptionDto(flightOptionParsed);
      flightOptionsMap.set(flightOptionDto.id, flightOptionDto);
    });

    const flightSegmentsDataSet = newDataSet['Segmentler'] ?? [];
    const flightOptionsWithSegments: {
      flightOption: FlightOptionDto;
      segments: DomesticFlightSegmentDto[];
    }[] = [];

    flightSegmentsDataSet.forEach((entry) => {
      const flightSegmentParsed: FlightSegment = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightSegmentParsed[key] = value;
      }
      const flightSegmentDto = new DomesticFlightSegmentDto(
        flightSegmentParsed,
      );
      const optionId = flightSegmentDto.optionId;

      if (flightOptionsMap.has(optionId)) {
        const flightOption = flightOptionsMap.get(optionId)!;

        const existingEntry = flightOptionsWithSegments.find(
          (opt) => opt.flightOption.id === optionId,
        );
        if (existingEntry) {
          existingEntry.segments.push(flightSegmentDto);
        } else {
          flightOptionsWithSegments.push({
            flightOption,
            segments: [flightSegmentDto],
          });
        }
      }
    });

    const optionFaresDataSet = newDataSet['SecenekUcretler'] ?? [];
    const optionFaresBySecenekID2 = new Map<string, OptionFareDto[]>();

    optionFaresDataSet.forEach((entry) => {
      const optionFareParsed: OptionFare = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        optionFareParsed[key] = value;
      }
      const optionFareDto = new OptionFareDto(optionFareParsed);
      const secenekID2 = optionFareDto.optionId2;

      if (secenekID2) {
        if (!optionFaresBySecenekID2.has(secenekID2)) {
          optionFaresBySecenekID2.set(secenekID2, []);
        }
        optionFaresBySecenekID2.get(secenekID2)?.push(optionFareDto);
      }
    });

    const optionFareDetailsDataSet = newDataSet['SecenekUcretDetaylar'] ?? [];
    const optionFareDetailsMap = new Map<string, OptionFareDetailDto[]>();

    optionFareDetailsDataSet.forEach((entry) => {
      const optionFareDetailParsed: OptionFareDetail = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        optionFareDetailParsed[key] = value;
      }
      const optionFareDetailDto = new OptionFareDetailDto(
        optionFareDetailParsed,
      );
      const optionFareId = optionFareDetailDto.optionFareId;

      if (!optionFareDetailsMap.has(optionFareId)) {
        optionFareDetailsMap.set(optionFareId, []);
      }
      optionFareDetailsMap.get(optionFareId)?.push(optionFareDetailDto);
    });

    const segmentClassesDataSet = newDataSet['SegmentSiniflar'] ?? [];
    const segmentClassesByOptionFareId = new Map<string, SegmentClassDto[]>();

    segmentClassesDataSet.forEach((entry) => {
      const segmentClassParsed: SegmentClass = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        segmentClassParsed[key] = value;
      }
      const segmentClassDto = new SegmentClassDto(segmentClassParsed);
      const optionFareId = segmentClassDto.optionFareId;

      if (!segmentClassesByOptionFareId.has(optionFareId)) {
        segmentClassesByOptionFareId.set(optionFareId, []);
      }
      segmentClassesByOptionFareId.get(optionFareId)?.push(segmentClassDto);
    });

    const departureFlightsWithFares = this.createFinalResponseWithFares(
      flightOptionsWithSegments,
      optionFaresBySecenekID2,
      optionFareDetailsMap,
      segmentClassesByOptionFareId,
      false,
    );

    const returnFlightOptionsDataSet = newDataSet['DonusSecenekler'] ?? [];
    const returnFlightSegmentsDataSet = newDataSet['DonusSegmentler'] ?? [];

    const returnFlightOptionsMap = new Map<string, FlightOptionDto>();
    returnFlightOptionsDataSet.forEach((entry) => {
      const flightOptionParsed: FlightOption = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightOptionParsed[key] = value;
      }
      const flightOptionDto = new FlightOptionDto(flightOptionParsed);
      returnFlightOptionsMap.set(flightOptionDto.id, flightOptionDto);
    });

    const returnFlightOptionsWithSegments: {
      flightOption: FlightOptionDto;
      segments: DomesticFlightSegmentDto[];
    }[] = [];

    returnFlightSegmentsDataSet.forEach((entry) => {
      const flightSegmentParsed: FlightSegment = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightSegmentParsed[key] = value;
      }
      const flightSegmentDto = new DomesticFlightSegmentDto(
        flightSegmentParsed,
      );
      const optionId = flightSegmentDto.optionId;

      if (returnFlightOptionsMap.has(optionId)) {
        const flightOption = returnFlightOptionsMap.get(optionId)!;

        const existingEntry = returnFlightOptionsWithSegments.find(
          (opt) => opt.flightOption.id === optionId,
        );
        if (existingEntry) {
          existingEntry.segments.push(flightSegmentDto);
        } else {
          returnFlightOptionsWithSegments.push({
            flightOption,
            segments: [flightSegmentDto],
          });
        }
      }
    });

    const ReturnFlightsWithFares = this.createFinalResponseWithFares(
      returnFlightOptionsWithSegments,
      optionFaresBySecenekID2,
      optionFareDetailsMap,
      segmentClassesByOptionFareId,
      true,
    );

    return {
      departureFlightsWithFares,
      ReturnFlightsWithFares,
    };
  };

  private createFinalResponseWithFares(
    optionsWithSegments: {
      flightOption: FlightOptionDto;
      segments: DomesticFlightSegmentDto[];
    }[],
    optionFaresByOptionId: Map<string, OptionFareDto[]>,
    optionFareDetailsMap: Map<string, OptionFareDetailDto[]>,
    segmentClassesByOptionFareId: Map<string, SegmentClassDto[]>,
    useId2ForFares = false,
  ) {
    return optionsWithSegments.map((entry) => {
      const flightOptionId = useId2ForFares
        ? entry.flightOption.id2
        : entry.flightOption.id;
      const relatedOptionFares =
        optionFaresByOptionId.get(flightOptionId) || [];
      const segmentsWithClasses = entry.segments.map((segment) => {
        const segmentOptionFares = relatedOptionFares.map((fare) => {
          const segmentClassesForFare =
            segmentClassesByOptionFareId.get(fare.id) || [];
          const segmentClassForOptionFare = segmentClassesForFare.length
            ? segmentClassesForFare[0]
            : null;

          return {
            ...fare,
            fareDetails: optionFareDetailsMap.get(fare.id) || [],
            segmentClass: segmentClassForOptionFare,
          };
        });

        return {
          ...segment,
          optionFares: segmentOptionFares,
        };
      });

      return {
        flightOption: entry.flightOption,
        segments: segmentsWithClasses,
      };
    });
  }

  public parseAbroadFlightResponse = (
    response: AbroadFlightResponse,
  ): AbroadFlightScheduleDto => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];

    const flightOptionsDataSet = newDataSet['Secenekler'] ?? [];
    const flightOptionsMap = new Map<string, AbroadFlightOptionDto>();

    flightOptionsDataSet.forEach((entry) => {
      const flightOptionParsed: AbroadFlightOption = Object.assign({});

      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightOptionParsed[key] = value;
      }
      const flightOptionDto = new AbroadFlightOptionDto(flightOptionParsed);
      flightOptionsMap.set(flightOptionDto.id, flightOptionDto);
    });

    const flightSegmentsDataSet = newDataSet['Segmentler'] ?? [];

    const groupedSegments: { [key: string]: AbroadFlightSegmentDto[] } = {};

    flightSegmentsDataSet.forEach((entry: any) => {
      const flightSegmentParsed: AbroadFlightSegment = Object.assign({});

      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightSegmentParsed[key] = value;
      }
      const flightSegmentDto = new AbroadFlightSegmentDto(flightSegmentParsed);

      if (!groupedSegments[flightSegmentDto.flightId]) {
        groupedSegments[flightSegmentDto.flightId] = [];
      }

      groupedSegments[flightSegmentDto.flightId].push(flightSegmentDto);
    });

    const departureFlights = Object.entries(groupedSegments).map(
      ([flightId, segments]) => {
        const optionId = segments[0]?.optionId;
        const flightOption = flightOptionsMap.get(optionId);

        return {
          flightOption,
          flightId: `${flightId}`,
          segments,
        };
      },
    );

    const returnFlightSegmentsDataSet = newDataSet['DonusSegmentler'] ?? [];

    const groupedReturnSegments: { [key: string]: AbroadFlightSegmentDto[] } =
      {};
    returnFlightSegmentsDataSet.forEach((entry: any) => {
      const flightSegmentParsed: AbroadFlightSegment = Object.assign({});

      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightSegmentParsed[key] = value;
      }

      const flightSegmentDto = new AbroadFlightSegmentDto(flightSegmentParsed);

      if (!groupedReturnSegments[flightSegmentDto.flightId]) {
        groupedReturnSegments[flightSegmentDto.flightId] = [];
      }

      groupedReturnSegments[flightSegmentDto.flightId].push(flightSegmentDto);
    });

    const returnFlights = Object.entries(groupedReturnSegments).map(
      ([flightId, segments]) => {
        const optionId = segments[0]?.optionId;
        const flightOption = flightOptionsMap.get(optionId);

        return {
          flightOption,
          flightId: `${flightId}`,
          segments,
        };
      },
    );

    const operationIdArray = newDataSet['IslemId'] ?? [];
    let operationId = null;
    if (operationIdArray.length > 0 && operationIdArray[0]?.Value) {
      operationId = operationIdArray[0].Value[0];
    }

    return { departureFlights, returnFlights, operationId };
  };

  public parsePullAbroadFlightPricePackagesResponse = (
    response: pullAbroadFlightPricePackagesResponse,
  ): any => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['BrandFareResponse']?.[0] || {};

    const brandFareInfosDataSet =
      newDataSet['BrandFareInfos']?.[0]?.BrandFareInfo || [];
    console.warn('Brand Fare Infos Data Set:', brandFareInfosDataSet);

    const parseBrandFareInfos = (brandFareInfos: any[]): BrandFareInfoDto[] => {
      if (!Array.isArray(brandFareInfos)) {
        console.warn('brandFareInfos is not an array:', brandFareInfos);
        return [];
      }

      return brandFareInfos.map((brandFareInfo) => {
        const { $: _, ...rest } = brandFareInfo || {};
        console.warn('Parsing BrandFareInfo:', rest);

        const brandFareData: BrandFareInfoDto = {
          isBundle: rest.IsBundle?.[0] || '',
          tripType: rest.TripType?.[0] || '',
          brandPriceInfo: parseBrandPriceInfo(rest.BrandPriceInfo?.[0] || {}),
          brandInfo: parseBrandInfo(rest.BrandInfo?.[0] || {}),
          brandSegmentInfos: parseBrandSegmentInfos(
            rest.BrandSegmentInfos?.[0]?.BrandSegmentInfo || [],
          ),
          brandImportantNotes: parseBrandImportantNotes(
            rest.BrandImportantNotes?.[0]?.BrandImportantNote || [],
          ),
        };

        return brandFareData;
      });
    };

    const parseBrandPriceInfo = (brandPriceInfo): BrandPriceInfoDto => {
      if (!brandPriceInfo) {
        console.warn('brandPriceInfo is undefined or null:', brandPriceInfo);
        throw new Error('Invalid brandPriceInfo');
      }

      console.warn('Parsing Brand Price Info:', brandPriceInfo);

      const passengerTypeFareInfos =
        brandPriceInfo.PassengerTypeFareInfos?.[0]?.PassengerTypeFareInfo || [];

      console.log('Extracted PassengerTypeFareInfos:', passengerTypeFareInfos);

      const baggageInfo = brandPriceInfo.BaggageInformation?.[0] || '';
      const cleanedBaggageInfo = baggageInfo.replace(/[\r\n]+/g, ' ').trim();
      const brandPriceData: BrandPriceInfoDto = {
        ...brandPriceInfo,
        PassengerTypeFareInfos: parsePassengerTypeFareInfos(
          passengerTypeFareInfos,
        ),
        servicePriceMax: brandPriceInfo.ServicePriceMax?.[0] || '',
        servicePriceKA: brandPriceInfo.ServicePriceKA?.[0] || '',
        servicePriceBA: brandPriceInfo.ServicePriceBA?.[0] || '',
        sotalPassengerCount: brandPriceInfo.TotalPassengerCount?.[0] || '',
        totalPrice: brandPriceInfo.TotalPrice?.[0] || '',
        totalBasePrice: brandPriceInfo.TotalBasePrice?.[0] || '',
        totalTaxPrice: brandPriceInfo.TotalTaxPrice?.[0] || '',
        totalServicePrice: brandPriceInfo.TotalServicePrice?.[0] || '',
        totalMinimumServicePrice:
          brandPriceInfo.TotalMinimumServicePrice?.[0] || '',
        baggageInformation: cleanedBaggageInfo,
      };

      console.log('Parsed Brand Price Data:', brandPriceData);

      return brandPriceData;
    };

    const parsePassengerTypeFareInfos = (
      passengerTypeFareInfos: any[],
    ): PassengerTypeFareInfoDto[] => {
      if (!Array.isArray(passengerTypeFareInfos)) {
        console.warn(
          'PassengerTypeFareInfos is not an array:',
          passengerTypeFareInfos,
        );
        return [];
      }

      const parsedInfos: PassengerTypeFareInfoDto[] = [];

      passengerTypeFareInfos.forEach((passengerTypeFareInfo, index) => {
        const { $: _, ...rest } = passengerTypeFareInfo || {};

        if (!rest) {
          console.warn(
            `PassengerTypeFareInfo at index ${index} is undefined or null.`,
          );
          return;
        }

        console.warn(`Parsing PassengerTypeFareInfo at index ${index}:`, rest);

        const priceOfPieces = rest.PriceOfPieces?.[0]?.PriceOfPiece || [];
        const baggageAllowances =
          rest.BaggageAllowances?.[0]?.BaggageAllowance || [];

        console.warn(`PriceOfPieces at index ${index}:`, priceOfPieces);
        console.warn(`BaggageAllowances at index ${index}:`, baggageAllowances);

        const passengerTypeFareData: PassengerTypeFareInfo = {
          PassengerCount: rest.PassengerCount?.[0] || '0',
          PassengerType: rest.PassengerType?.[0] || '',
          PriceOfPieces: parsePriceOfPieces(priceOfPieces),
          BaggageAllowances: parseBaggageAllowances(baggageAllowances),
          SinglePassengerPrice: rest.SinglePassengerPrice?.[0] || '0',
          TotalPrice: rest.TotalPrice?.[0] || '0',
          MinimumServicePrice: rest.MinimumServicePrice?.[0] || '0',
          IsFirmCardRequired: rest.IsFirmCardRequired?.[0] || 'false',
        };

        console.log(
          `Parsed PassengerTypeFareData at index ${index}:`,
          passengerTypeFareData,
        );

        try {
          const dto = new PassengerTypeFareInfoDto(passengerTypeFareData);
          console.log(dto, 'XXXXXXX');
          parsedInfos.push(dto);
        } catch (error) {
          console.error(
            `Failed to create PassengerTypeFareInfoDto at index ${index}:`,
            error,
          );
        }
      });

      if (parsedInfos.length === 0) {
        console.warn(
          'No valid PassengerTypeFareInfoDto created. Input data:',
          passengerTypeFareInfos,
        );
      }

      return parsedInfos;
    };

    const parsePriceOfPieces = (priceOfPieces: any[]): PriceOfPiece[] => {
      if (!Array.isArray(priceOfPieces)) {
        console.warn('PriceOfPieces is not an array:', priceOfPieces);
        return [];
      }

      return priceOfPieces.map((piece) => {
        const priceOfPieceData: PriceOfPiece = {
          PriceType: piece.PriceType?.[0] || '',
          Price: piece.Price?.[0] || '',
        };
        return priceOfPieceData;
      });
    };

    const parseBaggageAllowances = (
      baggageAllowances: any[],
    ): BaggageAllowance[] => {
      if (!Array.isArray(baggageAllowances)) {
        console.warn('baggageAllowances is not an array:', baggageAllowances);
        return [];
      }

      return baggageAllowances.map((allowance, index) => {
        console.log(`Processing allowance at index ${index}:`, allowance);
        const seatBaggageData = allowance.SeatBaggage?.[0] || {};

        const seatBaggageParsed = {
          PieceCount: seatBaggageData.PieceCount?.[0] || '0',
          Amount: seatBaggageData.Amount?.[0] || '0',
          Unit: seatBaggageData.Unit?.[0] || '',
          BaggageType: seatBaggageData.BaggageType || [],
          Dimensions: seatBaggageData.Dimensions?.[0] || '',
          SeatBaggageInfo: seatBaggageData.SeatBaggageInfo?.[0] || '',
        };

        const baggageAllowanceParsed: BaggageAllowance = {
          Origin: allowance.Origin || '',
          Destination: allowance.Destination || '',
          DepartureTime: allowance.DepartureTime || '',
          Carrier: allowance.Carrier || '',
          SeatBaggage: seatBaggageParsed,
        };

        console.log(
          `Parsed BaggageAllowance for index ${index}:`,
          baggageAllowanceParsed,
        );
        return baggageAllowanceParsed;
      });
    };

    const parseBrandInfo = (brandInfo): BrandInfoDto => {
      if (!brandInfo) {
        console.warn('brandInfo is undefined or null:', brandInfo);
      }

      console.log('Raw brandInfo:', brandInfo);

      const brandInfoData: BrandInfoDto = {
        isActive: brandInfo.IsActive?.[0] === 'true' ? 'true' : 'false',
        isRecommended:
          brandInfo.IsRecommended?.[0] === 'true' ? 'true' : 'false',
        brandId: brandInfo.BrandId?.[0] || '',
        brandCode: brandInfo.BrandCode?.[0] || '',
        brandName: brandInfo.BrandName?.[0] || '',
        brandTier: brandInfo.BrandTier?.[0] || '',
        brandNote: brandInfo.BrandNote?.[0] || '',
        class: brandInfo.Class?.[0] || '',
        cabinClass: brandInfo.CabinClass?.[0] || '',
        brandServiceInfos: parseBrandServiceInfos(
          brandInfo.BrandServiceInfos?.[0]?.BrandServiceInfo || [],
        ),
      };

      console.log('Parsed brandInfoData:', brandInfoData);

      return brandInfoData;
    };

    const parseBrandServiceInfos = (
      brandServiceInfos,
    ): BrandServiceInfoDto[] => {
      if (!Array.isArray(brandServiceInfos)) {
        console.warn('BrandServiceInfos is not an array:', brandServiceInfos);
        return [];
      }

      console.log('Raw brandServiceInfos:', brandServiceInfos);

      return brandServiceInfos.map((serviceInfo) => {
        const { $: _, ...rest } = serviceInfo || {};
        console.log('Processing BrandServiceInfo:', rest);

        const brandServiceInfoData: BrandServiceInfoDto = {
          name: rest.Name?.[0] || '',
          order: rest.Order?.[0] || '',
          brandServices: parseBrandServices(
            rest.BrandServices?.[0]?.BrandService || [],
          ),
        };

        console.log('Parsed BrandServiceInfo:', brandServiceInfoData);

        return brandServiceInfoData;
      });
    };

    const parseBrandServices = (brandServices): BrandServiceDto[] => {
      if (!Array.isArray(brandServices)) {
        console.warn('BrandServices is not an array:', brandServices);
        return [];
      }

      console.log('Raw brandServices:', brandServices);

      return brandServices.map((service) => {
        console.log('Parsing BrandService:', service);

        return {
          definition: service.Definition?.[0] || '',
          serviceStatus: service.ServiceStatus?.[0] || '',
          serviceType: service.ServiceType?.[0] || '',
          serviceTag: service.ServiceTag?.[0] || '',
          displayOrder: service.DisplayOrder?.[0] || '',
        };
      });
    };

    const parseBrandSegmentInfos = (
      brandSegmentInfos,
    ): BrandSegmentInfoDto[] => {
      if (!Array.isArray(brandSegmentInfos)) {
        console.warn('BrandSegmentInfos is not an array:', brandSegmentInfos);
        return [];
      }

      console.log('Raw brandSegmentInfos:', brandSegmentInfos);

      return brandSegmentInfos.map((segmentInfo) => {
        console.log('Parsing BrandSegmentInfo:', segmentInfo);

        const segmentInfoData: BrandSegmentInfoDto = {
          companyNo: segmentInfo.CompanyNo?.[0] || '',
          origin: segmentInfo.Origin?.[0] || '',
          destination: segmentInfo.Destination?.[0] || '',
          classOfService: segmentInfo.ClassOfService?.[0] || '',
          departureTime: segmentInfo.DepartureTime?.[0] || '',
          arrivalTime: segmentInfo.ArrivalTime?.[0] || '',
          cabinClass: segmentInfo.CabinClass?.[0] || '',
          flightNumber: segmentInfo.FlightNumber?.[0] || '',
          carrierCode: segmentInfo.CarrierCode?.[0] || '',
          operatingCarrierCode: segmentInfo.OperatingCarrierCode?.[0] || '',
          fareRuleKey: segmentInfo.FareRuleKey?.[0] || '',
          tripCode: segmentInfo.TripCode?.[0] || '',
          pricePackageDefinition: segmentInfo.PricePackageDefinition?.[0] || '',
          pricePackageKey: segmentInfo.PricePackageKey?.[0] || '',
          isReturn: segmentInfo.IsReturn?.[0] || '',
          pricePackageDetailKey: segmentInfo.PricePackageDetailKey?.[0] || '',
          fareInfoRef: segmentInfo.FareInfoRef?.[0] || '',
          group: segmentInfo.Group?.[0] || '',
        };
        console.log(segmentInfoData);
        return segmentInfoData;
      });
    };

    const parseBrandImportantNotes = (
      brandImportantNotes,
    ): BrandImportantNoteDto[] => {
      if (!Array.isArray(brandImportantNotes)) {
        console.warn(
          'BrandImportantNotes is not an array:',
          brandImportantNotes,
        );
        return [];
      }

      console.log('Raw brandImportantNotes:', brandImportantNotes);

      return brandImportantNotes.map((note) => {
        console.log('Parsing BrandImportantNote:', note);

        const brandImportantNoteDto: BrandImportantNoteDto = {
          note: note.Note?.[0] || '',
          origin: note.Origin?.[0]?.$ || '',
          destination: note.Destination?.[0]?.$ || '',
        };

        console.log({ brandImportantNoteDto });
        return brandImportantNoteDto;
      });
    };

    const brandFareInfosDto = parseBrandFareInfos(brandFareInfosDataSet);
    console.warn('Parsed BrandFareInfosDto:', brandFareInfosDto);

    return {
      transactionId: newDataSet.TransactionId?.[0] || '',
      currencyTypeCode: newDataSet.CurrencyTypeCode?.[0] || '',
      isSuccess: newDataSet.IsSuccess?.[0] === 'true',
      message: newDataSet?.Message?.[0] || '',
      brandFareInfos: brandFareInfosDto,
    };
  };

  public parsePullPriceOfFlightResponse = (
    response: PlanePullPriceResponse,
  ): PlanePullPriceFlightDto => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];

    const priceListDataSet = newDataSet['FiyatListesi'] ?? [];
    const PriceList = priceListDataSet.map((entry) => {
      const priceListParsed: PlanePrices = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        priceListParsed[key] = value;
      }
      return new PriceListDto(priceListParsed);
    });

    const paymentRulesDataSet = newDataSet['OdemeKurallari'] ?? [];
    const paymentRules = paymentRulesDataSet.map((entry) => {
      const paymentRuleParsed: PaymentRules = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        paymentRuleParsed[key] = value;
      }
      return new PlanePaymentRulesDto(paymentRuleParsed);
    });

    const baggageInfoDataSet = newDataSet['BagajBilgiler'] ?? [];
    const baggageInfo = baggageInfoDataSet.map((entry) => {
      const baggageInfoParsed: BaggageInfo = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        baggageInfoParsed[key] = value;
      }
      return new PlaneBaggageInfoDto(baggageInfoParsed);
    });

    const additionalServiceRulesDataSet = newDataSet['EkHizmetKurallar'][0];
    const additionalServiceRuleDataSet =
      additionalServiceRulesDataSet['EkHizmetKural'];
    const additionalServiceRules = additionalServiceRuleDataSet.map((entry) => {
      const additionalServiceRuleParsed: AdditionalServiceRule = Object.assign(
        {},
      );
      for (const [key, value] of ObjectTyped.entries(entry)) {
        additionalServiceRuleParsed[key] = value;
      }

      return new PlaneAdditionalServiceRuleDto(additionalServiceRuleParsed);
    });

    return new PlanePullPriceFlightDto(
      PriceList,
      paymentRules,
      baggageInfo,
      additionalServiceRules,
    );
  };

  public parsePassengerAgeRule = (
    response: PlanePassengerAgeRulesResponse,
  ): PlanePassengerAgeRuleDto[] => {
    const extractedResult = this.extractResult(response);
    const PassengerAgeRules =
      extractedResult['TasiyiciFirmaYolcuYasKurallar'][0];
    const PassengerAgeRule = PassengerAgeRules['TasiyiciFirmaYolcuYasKural'];

    return PassengerAgeRule.map((entry) => {
      const PassengerAgeRuleParsed: PlanePassengerAgeRule = Object.assign({});
      for (const [key, [value]] of Object.entries(entry)) {
        PassengerAgeRuleParsed[key] = value;
      }
      return new PlanePassengerAgeRuleDto(PassengerAgeRuleParsed);
    });
  };

  public parseFlightTicketReservation = (
    response: PlaneTicketReservationResponse,
  ): FlightTicketReservationDto => {
    const extractedResult = this.extractResult(response);
    const ticketResult = extractedResult['IslemSonuc'];

    if (!Array.isArray(ticketResult) || ticketResult.length === 0) {
      throw new Error('No ticket results found.');
    }
    const entry = ticketResult[0];

    const reservationParsed: FlightTicketReservationResult = {
      Sonuc: entry.Sonuc ? entry.Sonuc[0] : null,
      PNR: entry.PNR ? entry.PNR[0] : null,
      RezervasyonOpsiyon: entry.RezervasyonOpsiyon
        ? entry.RezervasyonOpsiyon[0]
        : null,
    };

    return new FlightTicketReservationDto(reservationParsed);
  };

  public parseFlightTicketPurchase = (
    response: PlaneTicketPurchaseResponse,
  ): FlightTicketPurchaseDto => {
    const extractedResult = this.extractResult(response);
    const ticketResult = extractedResult['IslemSonuc'];

    if (!Array.isArray(ticketResult) || ticketResult.length === 0) {
      throw new Error('No ticket results found.');
    }
    const entry = ticketResult[0];

    const purchaseParsed: FlightTicketPurchaseResult = {
      Sonuc: entry.Sonuc || [],
      PNR: entry.PNR || [],
      EBilet: entry.EBilet || {},
    };

    return new FlightTicketPurchaseDto(purchaseParsed);
  };
}
