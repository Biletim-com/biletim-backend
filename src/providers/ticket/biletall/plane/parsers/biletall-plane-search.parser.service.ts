import { Injectable } from '@nestjs/common';

import { BiletAllParserService } from '../../services/biletall-response-parser.service';

//dto
import {
  AbroadFlightOptionDto,
  AbroadFlightDto,
  AbroadFlightSegmentDto,
  AbroadFlightScheduleDto,
} from '../dto/plane-abroad-flight-schedule.dto';
import { PlaneAirportDto } from '../dto/plane-airport.dto';
import { PlanePassengerAgeRuleDto } from '../dto/plane-company-passenger-age-rule.dto';
import {
  DomesticFlightScheduleDto,
  DomesticFlightSegmentDto,
  FlightOptionDto,
  OptionFareDto,
  OptionFareDetailDto,
  SegmentClassDto,
  DomesticFlightWithFares,
} from '../dto/plane-domestic-flight-schedule.dto';
import {
  PullAbroadFlightPricePackagesResponseDto,
  BrandFareInfoDto,
  BrandPriceInfoDto,
  PassengerTypeFareInfoDto,
  BrandInfoDto,
  BrandServiceInfoDto,
  BrandServiceDto,
  BrandSegmentInfoDto,
  BrandImportantNoteDto,
} from '../dto/plane-pull-abroad-flight-price-packages.dto';
import {
  PlanePullPriceFlightDto,
  PriceListDto,
  PlanePaymentRulesDto,
  PlaneBaggageInfoDto,
  PlaneAdditionalServiceRuleDto,
} from '../dto/plane-pull-price-flight.dto';

// types
import {
  PlaneAirport,
  PlaneAirportResponse,
} from '../types/biletall-plane-airport.type';
import {
  AdditionalServiceRule,
  BaggageInfo,
  PaymentRules,
  PlanePrices,
  PlanePullPriceResponse,
} from '../types/biletall-plane-pull-price-flight.type';
import {
  PlanePassengerAgeRule,
  PlanePassengerAgeRulesResponse,
} from '../types/biletall-plane-company-passanger-age-rules.type';
import {
  AbroadFlightOption,
  AbroadFlightResponse,
  AbroadFlightSegment,
} from '../types/biletall-plane-abroad-flight-schedule.type';
import {
  DomesticFlightResponse,
  FlightOption,
  FlightSegment,
  OptionFare,
  OptionFareDetail,
  SegmentClass,
} from '../types/biletall-plane-domistic-flight-schedule.type';
import {
  BaggageAllowance,
  PassengerTypeFareInfo,
  PriceOfPiece,
  pullAbroadFlightPricePackagesResponse,
} from '../types/biletall-plane-pull-abroad-flight-price-packages.type';

// utils
import { ObjectTyped } from '@app/common/utils';

@Injectable()
export class BiletAllPlaneSearchParserService extends BiletAllParserService {
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

    // map segment classes
    const segmentClassesDataSet = newDataSet['SegmentSiniflar'] ?? [];
    const segmentClassesMap = new Map<string, SegmentClassDto>();
    segmentClassesDataSet.forEach((entry) => {
      const segmentClassParsed: SegmentClass = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        segmentClassParsed[key] = value;
      }
      const segmentClassDto = new SegmentClassDto(segmentClassParsed);
      const segmentClassIdentifier = `${segmentClassDto.segmentId2}:${segmentClassDto.optionFareId}`;

      segmentClassesMap.set(segmentClassIdentifier, segmentClassDto);
    });

    // map option fare details
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

    // Build Parsed Option Fares
    const optionFaresDataSet = newDataSet['SecenekUcretler'] ?? [];
    const optionFaresParsed = optionFaresDataSet.map((optionFare) => {
      const optionFareParsed: OptionFare = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(optionFare)) {
        optionFareParsed[key] = value;
      }
      return optionFareParsed;
    });

    /**
     * Prepare departure flights
     */
    // build FlightOptionsDto
    const flightOptionsDataSet = newDataSet['Secenekler'] ?? [];
    const flightOptions = flightOptionsDataSet.map((flightOption) => {
      const flightOptionParsed: FlightOption = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(flightOption)) {
        flightOptionParsed[key] = value;
      }
      return new FlightOptionDto(flightOptionParsed);
    });
    // build FlightSegmentsDto
    const flightSegmentsDataSet = newDataSet['Segmentler'] ?? [];
    const flightSegments = flightSegmentsDataSet.map((flightSegment) => {
      const flightOptionParsed: FlightSegment = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(flightSegment)) {
        flightOptionParsed[key] = value;
      }
      return new DomesticFlightSegmentDto(flightOptionParsed);
    });
    const departureFlightsWithFares = this.parseDomesticFlightSegments(
      flightOptions,
      flightSegments,
      optionFaresParsed,
      segmentClassesMap,
      optionFareDetailsMap,
    );

    /**
     * Prepare return flights
     */
    // build FlightOptionsDto
    const returnFlightOptionsDataSet = newDataSet['DonusSecenekler'] ?? [];
    const returnFlightOptions = returnFlightOptionsDataSet.map(
      (returnFlightOption) => {
        const returnFlightOptionParsed: FlightOption = Object.assign({});
        for (const [key, [value]] of ObjectTyped.entries(returnFlightOption)) {
          returnFlightOptionParsed[key] = value;
        }
        return new FlightOptionDto(returnFlightOptionParsed);
      },
    );
    // build FlightSegmentsDto
    const returnFlightSegmentsDataSet = newDataSet['DonusSegmentler'] ?? [];
    const returnFlightSegments = returnFlightSegmentsDataSet.map(
      (returnFlightSegment) => {
        const returnFlightOptionParsed: FlightSegment = Object.assign({});
        for (const [key, [value]] of ObjectTyped.entries(returnFlightSegment)) {
          returnFlightOptionParsed[key] = value;
        }
        return new DomesticFlightSegmentDto(returnFlightOptionParsed);
      },
    );
    const returnFlightsWithFares = this.parseDomesticFlightSegments(
      returnFlightOptions,
      returnFlightSegments,
      optionFaresParsed,
      segmentClassesMap,
      optionFareDetailsMap,
    );

    return {
      departureFlightsWithFares,
      returnFlightsWithFares,
    };
  };

  private parseDomesticFlightSegments(
    flightOptionsDataSet: FlightOptionDto[],
    flightSegmentsDataSet: DomesticFlightSegmentDto[],
    optionFaresDataSet: OptionFare[],
    segmentClassesMap: Map<string, SegmentClassDto>,
    optionFareDetailsMap: Map<string, OptionFareDetailDto[]>,
  ): DomesticFlightWithFares[] {
    const flightSegmentsMap = new Map<string, DomesticFlightSegmentDto[]>();
    flightSegmentsDataSet.forEach((flightSegment) => {
      const flightOptionId = flightSegment.optionId;

      if (!flightSegmentsMap.has(flightOptionId)) {
        flightSegmentsMap.set(flightOptionId, []);
      }
      flightSegmentsMap.get(flightOptionId)?.push(flightSegment);
    });

    return flightOptionsDataSet.map((flightOption) => {
      const enrichedSegments = (
        flightSegmentsMap.get(flightOption.id) || []
      ).map((segment) => {
        const enrichedOptionFares = optionFaresDataSet
          .filter((optionFare) => optionFare.SecenekID2 === flightOption.id2)
          .map((optionFare) => {
            return new OptionFareDto(
              optionFare,
              optionFareDetailsMap.get(optionFare.ID) || [],
              segmentClassesMap.get(`${segment.id2}:${optionFare.ID}`),
            );
          });

        return {
          ...segment,
          optionFares: enrichedOptionFares,
        };
      });

      return {
        flightOption,
        segments: enrichedSegments,
      };
    });
  }

  private parseAbroadFlightSegments(
    flightSegmentsDataSet: Array<{
      [K in keyof AbroadFlightSegment]: [string];
    }>,
    flightOptionsMap: Map<string, AbroadFlightOptionDto>,
  ): AbroadFlightDto[] {
    const groupedSegments: { [key in string]: AbroadFlightSegmentDto[] } = {};

    flightSegmentsDataSet.forEach((entry) => {
      const flightSegmentParsed: AbroadFlightSegment = Object.assign({});
      Object.entries(entry).forEach(([key, [value]]) => {
        flightSegmentParsed[key] = value;
      });
      const flightSegmentDto = new AbroadFlightSegmentDto(flightSegmentParsed);

      const segmentIdentifier = `${flightSegmentDto.optionId}:${flightSegmentDto.flightId}`;
      if (!groupedSegments[segmentIdentifier]) {
        groupedSegments[segmentIdentifier] = [];
      }

      groupedSegments[segmentIdentifier].push(flightSegmentDto);
    });

    const dataToReturn: AbroadFlightDto[] = [];

    ObjectTyped.entries(groupedSegments).forEach(
      ([segmentIdentifier, segments]) => {
        const [optionId, flightId] = segmentIdentifier.split(':');
        const flightOption = flightOptionsMap.get(optionId);

        if (flightOption) {
          dataToReturn.push({
            flightOption,
            flightId,
            segments,
          });
        }
      },
    );
    return dataToReturn;
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
    const departureFlights = this.parseAbroadFlightSegments(
      flightSegmentsDataSet,
      flightOptionsMap,
    );

    const returnFlightSegmentsDataSet = newDataSet['DonusSegmentler'] ?? [];
    const returnFlights = this.parseAbroadFlightSegments(
      returnFlightSegmentsDataSet,
      flightOptionsMap,
    );

    const operationId = newDataSet['IslemId']?.[0]?.Value?.[0] ?? null;

    return { departureFlights, returnFlights, operationId };
  };

  public parsePullAbroadFlightPricePackagesResponse = (
    response: pullAbroadFlightPricePackagesResponse,
  ): PullAbroadFlightPricePackagesResponseDto => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['BrandFareResponse']?.[0] || {};

    const brandFareInfosDataSet =
      newDataSet['BrandFareInfos']?.[0]?.BrandFareInfo || [];

    const parseBrandFareInfos = (brandFareInfos: any[]): BrandFareInfoDto[] => {
      if (!Array.isArray(brandFareInfos)) {
        return [];
      }

      return brandFareInfos.map((brandFareInfo) => {
        const { $: _, ...rest } = brandFareInfo || {};

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
        return {
          passengerTypeFareInfos: [],
          servicePriceMax: '',
          servicePriceKA: '',
          servicePriceBA: '',
          totalPassengerCount: '',
          totalPrice: '',
          totalBasePrice: '',
          totalTaxPrice: '',
          totalServicePrice: '',
          totalMinimumServicePrice: '',
          baggageInformation: '',
        };
      }

      const passengerTypeFareInfos =
        brandPriceInfo.PassengerTypeFareInfos?.[0]?.PassengerTypeFareInfo || [];

      const baggageInfo = brandPriceInfo.BaggageInformation?.[0] || '';
      const cleanedBaggageInfo = baggageInfo.replace(/[\r\n]+/g, ' ').trim();
      const brandPriceData: BrandPriceInfoDto = {
        passengerTypeFareInfos: parsePassengerTypeFareInfos(
          passengerTypeFareInfos,
        ),
        servicePriceMax: brandPriceInfo.ServicePriceMax?.[0] || '',
        servicePriceKA: brandPriceInfo.ServicePriceKA?.[0] || '',
        servicePriceBA: brandPriceInfo.ServicePriceBA?.[0] || '',
        totalPassengerCount: brandPriceInfo.TotalPassengerCount?.[0] || '',
        totalPrice: brandPriceInfo.TotalPrice?.[0] || '',
        totalBasePrice: brandPriceInfo.TotalBasePrice?.[0] || '',
        totalTaxPrice: brandPriceInfo.TotalTaxPrice?.[0] || '',
        totalServicePrice: brandPriceInfo.TotalServicePrice?.[0] || '',
        totalMinimumServicePrice:
          brandPriceInfo.TotalMinimumServicePrice?.[0] || '',
        baggageInformation: cleanedBaggageInfo,
      };
      return brandPriceData;
    };

    const parsePassengerTypeFareInfos = (
      passengerTypeFareInfos: any[],
    ): PassengerTypeFareInfoDto[] => {
      if (!Array.isArray(passengerTypeFareInfos)) {
        return [];
      }
      const parsedInfos: PassengerTypeFareInfoDto[] = [];

      passengerTypeFareInfos.forEach((passengerTypeFareInfo) => {
        const { $: _, ...rest } = passengerTypeFareInfo || {};

        const priceOfPieces = rest.PriceOfPieces?.[0]?.PriceOfPiece || [];
        const baggageAllowances =
          rest.BaggageAllowances?.[0]?.BaggageAllowance || [];

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

        const dto = new PassengerTypeFareInfoDto(passengerTypeFareData);
        parsedInfos.push(dto);
      });

      return parsedInfos;
    };

    const parsePriceOfPieces = (priceOfPieces: any[]): PriceOfPiece[] => {
      if (!Array.isArray(priceOfPieces)) {
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
        return [];
      }

      return baggageAllowances.map((allowance) => {
        const seatBaggageData = allowance.SeatBaggage?.[0] || {};

        const seatBaggageParsed = {
          PieceCount: seatBaggageData.PieceCount?.[0] || '0',
          Amount: seatBaggageData.Amount?.[0] || '0',
          Unit: seatBaggageData.Unit?.[0] || '',
          BaggageType: seatBaggageData.BaggageType?.[0] || [],
          Dimensions: seatBaggageData.Dimensions?.[0] || '',
          SeatBaggageInfo: seatBaggageData.SeatBaggageInfo?.[0] || '',
        };

        const baggageAllowanceParsed: BaggageAllowance = {
          Origin: allowance.Origin?.[0] || '',
          Destination: allowance.Destination?.[0] || '',
          DepartureTime: allowance.DepartureTime?.[0] || '',
          Carrier: allowance.Carrier?.[0] || '',
          SeatBaggage: seatBaggageParsed,
        };

        return baggageAllowanceParsed;
      });
    };

    const parseBrandInfo = (brandInfo): BrandInfoDto => {
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

      return brandInfoData;
    };

    const parseBrandServiceInfos = (
      brandServiceInfos,
    ): BrandServiceInfoDto[] => {
      if (!Array.isArray(brandServiceInfos)) {
        return [];
      }

      return brandServiceInfos.map((serviceInfo) => {
        const { $: _, ...rest } = serviceInfo || {};

        const brandServiceInfoData: BrandServiceInfoDto = {
          name: rest.Name?.[0] || '',
          order: rest.Order?.[0] || '',
          brandServices: parseBrandServices(
            rest.BrandServices?.[0]?.BrandService || [],
          ),
        };
        return brandServiceInfoData;
      });
    };

    const parseBrandServices = (brandServices): BrandServiceDto[] => {
      if (!Array.isArray(brandServices)) {
        return [];
      }

      return brandServices.map((service) => {
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
        return [];
      }

      return brandSegmentInfos.map((segmentInfo) => {
        const segmentInfoData: BrandSegmentInfoDto = {
          companyNumber: segmentInfo.CompanyNo?.[0] || '',
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
        return segmentInfoData;
      });
    };

    const parseBrandImportantNotes = (
      brandImportantNotes,
    ): BrandImportantNoteDto[] => {
      if (!Array.isArray(brandImportantNotes)) {
        return [];
      }

      return brandImportantNotes.map((note) => {
        const brandImportantNoteDto: BrandImportantNoteDto = {
          note: note.Note?.[0] || '',
          origin: note.Origin?.[0]?.$ || '',
          destination: note.Destination?.[0]?.$ || '',
        };
        return brandImportantNoteDto;
      });
    };

    const brandFareInfosDto = parseBrandFareInfos(brandFareInfosDataSet);

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
    const priceListDataSet = newDataSet['FiyatListesi'][0];
    const paymentRulesDataSet = newDataSet['OdemeKurallari'][0];
    const baggageInfoDataSet = newDataSet['BagajBilgiler'] || [];
    const additionalServiceRulesDataSet = newDataSet['EkHizmetKurallar'] || [];

    const priceListParsed: PlanePrices = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(priceListDataSet)) {
      priceListParsed[key] = value;
    }
    const priceList = new PriceListDto(priceListParsed);

    const paymentRuleParsed: PaymentRules = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(paymentRulesDataSet)) {
      paymentRuleParsed[key] = value;
    }
    const paymentRules = new PlanePaymentRulesDto(paymentRuleParsed);

    const baggageInfo = baggageInfoDataSet.map((entry) => {
      const baggageInfoParsed: BaggageInfo = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        baggageInfoParsed[key] = value;
      }
      return new PlaneBaggageInfoDto(baggageInfoParsed);
    });

    const additionalServiceRules = additionalServiceRulesDataSet.map(
      (entry) => {
        const additionalServiceRuleDataSet = entry['EkHizmetKural'][0];
        const additionalServiceRuleParsed: AdditionalServiceRule =
          Object.assign({});
        for (const [key, value] of ObjectTyped.entries(
          additionalServiceRuleDataSet,
        )) {
          additionalServiceRuleParsed[key] = value[0];
        }
        return new PlaneAdditionalServiceRuleDto(additionalServiceRuleParsed);
      },
    );

    return new PlanePullPriceFlightDto(
      priceList,
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
}
