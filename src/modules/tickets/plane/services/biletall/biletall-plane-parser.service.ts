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
  PullAbroadFlightPricePackagesResponseDto,
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

  public parseFlightTicketReservation = (
    response: PlaneTicketReservationResponse,
  ): FlightTicketReservationDto => {
    const extractedResult = this.extractResult(response);
    const ticketResult = extractedResult['IslemSonuc'][0];

    const reservationParsed: FlightTicketReservationResult = Object.assign({});
    for (const [key, value] of Object.entries(ticketResult)) {
      if (Array.isArray(value)) {
        reservationParsed[key] = value[0];
      }
    }

    return new FlightTicketReservationDto(reservationParsed);
  };

  public parseFlightTicketPurchase = (
    response: PlaneTicketPurchaseResponse,
  ): FlightTicketPurchaseDto => {
    const extractedResult = this.extractResult(response);
    const ticketResult = extractedResult['IslemSonuc'][0];

    const saleResultParsed: FlightTicketPurchaseResult = Object.assign({});
    for (const [key, value] of Object.entries(ticketResult)) {
      if (Array.isArray(value)) {
        saleResultParsed[key] = value[0];
      }
    }

    return new FlightTicketPurchaseDto(saleResultParsed);
  };
}
