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
  BrandFareInfo,
  pullAbroadFlightPricePackagesResponse,
} from './types/biletall-plane-pull-abroad-flight-price-packages.type';
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
    const newDataSet = extractedResult['BrandFareResponse'][0];
    const brandFareInfosDataSet = newDataSet['BrandFareInfos'] ?? [];

    const parseBrandFareInfos = (brandFareInfosDataSet) => {
      if (!brandFareInfosDataSet || !Array.isArray(brandFareInfosDataSet)) {
        return [];
      }

      return brandFareInfosDataSet.map((brandFareInfosEntry) => {
        const brandFareInfoParsed: BrandFareInfo =
          brandFareInfosEntry.BrandFareInfo?.[0] || {};

        return {
          ...brandFareInfoParsed,
          BrandPriceInfo: parseBrandPriceInfo(
            brandFareInfoParsed.BrandPriceInfo || {},
          ),
          BrandInfo: parseBrandInfo(brandFareInfoParsed.BrandInfo || {}),
          BrandSegmentInfos: parseBrandSegmentInfos(
            brandFareInfoParsed.BrandSegmentInfos || [],
          ),
          BrandImportantNotes: parseBrandImportantNotes(
            brandFareInfoParsed.BrandImportantNotes || [],
          ),
        };
      });
    };

    const parseBrandPriceInfo = (brandPriceInfo) => {
      if (!brandPriceInfo) {
        return {};
      }

      return {
        ...brandPriceInfo,
        PassengerTypeFareInfos: parsePassengerTypeFareInfos(
          brandPriceInfo.PassengerTypeFareInfos || [],
        ),
      };
    };

    const parsePassengerTypeFareInfos = (passengerTypeFareInfos) => {
      if (!passengerTypeFareInfos || !Array.isArray(passengerTypeFareInfos)) {
        return [];
      }

      return passengerTypeFareInfos.map((passengerTypeFareInfo) => {
        return {
          ...passengerTypeFareInfo,
          PriceOfPieces: parsePriceOfPieces(
            passengerTypeFareInfo.PriceOfPieces || [],
          ),
          BaggageAllowances: parseBaggageAllowances(
            passengerTypeFareInfo.BaggageAllowances || [],
          ),
        };
      });
    };

    const parsePriceOfPieces = (priceOfPieces) => {
      if (!priceOfPieces || !Array.isArray(priceOfPieces)) {
        return [];
      }

      return priceOfPieces.map((piece) => {
        return {
          ...piece,
        };
      });
    };

    const parseBaggageAllowances = (baggageAllowances) => {
      if (!baggageAllowances || !Array.isArray(baggageAllowances)) {
        return [];
      }

      return baggageAllowances.map((allowance) => {
        return {
          ...allowance,
        };
      });
    };
    const parseBrandInfo = (brandInfo) => {
      if (!brandInfo) {
        return {};
      }

      return {
        ...brandInfo,
        BrandServiceInfos: parseBrandServiceInfos(
          brandInfo.BrandServiceInfos || [],
        ),
      };
    };

    const parseBrandServiceInfos = (brandServiceInfos) => {
      if (!brandServiceInfos || !Array.isArray(brandServiceInfos)) {
        return [];
      }

      return brandServiceInfos.map((serviceInfo) => {
        return {
          ...serviceInfo,
          BrandServices: parseBrandServices(serviceInfo.BrandServices || []),
        };
      });
    };
    const parseBrandServices = (brandServices) => {
      if (!brandServices || !Array.isArray(brandServices)) {
        return [];
      }

      return brandServices.map((service) => {
        return {
          ...service,
        };
      });
    };

    const parseBrandSegmentInfos = (brandSegmentInfos) => {
      if (!brandSegmentInfos || !Array.isArray(brandSegmentInfos)) {
        return [];
      }

      return brandSegmentInfos.map((segmentInfo) => {
        return {
          ...segmentInfo,
        };
      });
    };

    const parseBrandImportantNotes = (brandImportantNotes) => {
      if (!brandImportantNotes || !Array.isArray(brandImportantNotes)) {
        return [];
      }

      return brandImportantNotes.map((note) => {
        return {
          ...note,
        };
      });
    };
    const brandFareInfosDto = parseBrandFareInfos(brandFareInfosDataSet);

    return {
      transactionId: newDataSet.TransactionId?.[0] || '',
      currencyTypeCode: newDataSet.CurrencyTypeCode?.[0] || '',
      isSuccess: newDataSet.IsSuccess?.[0] || '',
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
