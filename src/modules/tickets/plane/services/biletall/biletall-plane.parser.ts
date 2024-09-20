import { Injectable } from '@nestjs/common';
import {
  PlaneAirport,
  PlaneAirportResponse,
} from './types/biletall-plane-airport.type';
import { BiletAllParser } from '../../../bus/services/biletall/biletall-bus.parser';
import { PlaneAirportDto } from '../../dto/plane-airport.dto';
import {
  DomesticFlightResponse,
  FlightOption,
  FlightSegment,
  OptionFare,
  OptionFareDetail,
  SegmentClass,
} from './types/biletall-plane-domistic-flight-schedule.type';
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
  AbroadFlightOption,
  AbroadFlightResponse,
  AbroadFlightSegment,
} from './types/biletall-plane-abroad-flight-schedule.type';
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
import { PlanePassengerAgeRuleDto } from '../../dto/plane-company-passenger-age-rule.dto';
import {
  FlightTicketReservationResult,
  PlaneTicketReservationResponse,
} from './types/biletall-plane-ticket-reservation.type';
import { FlightTicketReservationDto } from '../../dto/plane-ticket-reservation.dto';
import { FlightTicketPurchaseDto } from '../../dto/plane-ticket-purchase.dto';
import {
  FlightTicketPurchaseResult,
  PlaneTicketPurchaseResponse,
} from './types/biletall-plane-ticket-purchase.type';

@Injectable()
export class BiletallPlaneParser {
  constructor(private readonly biletAllParser: BiletAllParser) {}

  public parseAirport = (response: PlaneAirportResponse): PlaneAirportDto[] => {
    const extractedResult = this.biletAllParser.extractResult(response);
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
    const extractedResult = this.biletAllParser.extractResult(response);
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

    const segmentClassesDataSet = newDataSet['SegmentSiniflar'] ?? [];
    const segmentClassesMap = new Map<string, SegmentClassDto>();

    segmentClassesDataSet.forEach((entry) => {
      const segmentClassParsed: SegmentClass = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        segmentClassParsed[key] = value;
      }
      const segmentClassDto = new SegmentClassDto(segmentClassParsed);
      segmentClassesMap.set(segmentClassDto.segmentId, segmentClassDto);
    });

    const optionFaresDataSet = newDataSet['SecenekUcretler'] ?? [];
    const optionFaresMap = new Map<string, OptionFareDto>();

    optionFaresDataSet.forEach((entry) => {
      const optionFareParsed: OptionFare = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        optionFareParsed[key] = value;
      }
      const optionFareDto = new OptionFareDto(optionFareParsed);
      optionFaresMap.set(optionFareDto.id, optionFareDto);
    });

    const optionFareDetailsDataSet = newDataSet['SecenekUcretDetaylar'] ?? [];
    const optionFaresWithDetails: {
      optionFare: OptionFareDto;
      details: OptionFareDetailDto[];
    }[] = [];

    optionFareDetailsDataSet.forEach((entry) => {
      const optionFareDetailParsed: OptionFareDetail = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        optionFareDetailParsed[key] = value;
      }
      const optionFareDetailDto = new OptionFareDetailDto(
        optionFareDetailParsed,
      );
      const optionFareId = optionFareDetailDto.optionFareId;

      if (optionFaresMap.has(optionFareId)) {
        const optionFare = optionFaresMap.get(optionFareId)!;

        const existingEntry = optionFaresWithDetails.find(
          (opt) => opt.optionFare.id === optionFareId,
        );
        if (existingEntry) {
          existingEntry.details.push(optionFareDetailDto);
        } else {
          optionFaresWithDetails.push({
            optionFare,
            details: [optionFareDetailDto],
          });
        }
      }
    });

    const finalOptionFaresResponse: {
      optionFare: OptionFareDto;
      optionFareDetail: OptionFareDetailDto[];
    }[] = optionFaresWithDetails.map((entry) => ({
      optionFare: entry.optionFare,
      optionFareDetail: entry.details,
    }));

    const optionFaresBySecenekID2 = new Map<
      string,
      { optionFare: OptionFareDto; optionFareDetail: OptionFareDetailDto[] }
    >();

    finalOptionFaresResponse.forEach((entry) => {
      const secenekID2 = entry.optionFare.optionId2;
      if (secenekID2) {
        optionFaresBySecenekID2.set(secenekID2, {
          optionFare: entry.optionFare,
          optionFareDetail: entry.optionFareDetail,
        });
      }
    });

    const finalResponseWithFares: {
      flightOption: FlightOptionDto;
      segments: DomesticFlightSegmentDto[];
      optionFare?: OptionFareDto;
      optionFareDetail?: OptionFareDetailDto[];
      segmentClass?: SegmentClassDto;
    }[] = flightOptionsWithSegments.map((entry) => {
      const flightOptionId = entry.flightOption.id;

      let relatedOptionFare;
      for (const [_key, value] of optionFaresBySecenekID2.entries()) {
        if (value.optionFare.optionId2 === flightOptionId) {
          relatedOptionFare = value;
          break;
        }
      }

      const segmentsWithClasses = entry.segments.map((segment) => {
        const segmentClass = segmentClassesMap.get(segment.id);
        return {
          ...segment,
          segmentClass,
        };
      });

      return {
        flightOption: entry.flightOption,
        segments: segmentsWithClasses,
        optionFare: relatedOptionFare?.optionFare,
        optionFareDetail: relatedOptionFare?.optionFareDetail,
        segmentClass:
          segmentsWithClasses.length > 0
            ? segmentsWithClasses[0].segmentClass
            : undefined,
      };
    });

    const returnFlightOptionsDataSet = newDataSet['DonusSecenekler'] ?? [];
    const returnFlightOptions = returnFlightOptionsDataSet.map((entry) => {
      const flightOptionParsed: FlightOption = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightOptionParsed[key] = value;
      }
      return new FlightOptionDto(flightOptionParsed);
    });

    const returnFlightSegmentsDataSet = newDataSet['DonusSegmentler'] ?? [];
    const returnFlightSegments = returnFlightSegmentsDataSet.map((entry) => {
      const flightSegmentParsed: FlightSegment = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightSegmentParsed[key] = value;
      }
      return new DomesticFlightSegmentDto(flightSegmentParsed);
    });

    return new DomesticFlightScheduleDto(
      finalResponseWithFares,
      returnFlightOptions,
      returnFlightSegments,
    );
  };

  public parseAbroadFlightResponse = (
    response: AbroadFlightResponse,
  ): AbroadFlightScheduleDto => {
    const extractedResult = this.biletAllParser.extractResult(response);
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

    const groupedFlight = Object.entries(groupedSegments).map(
      ([flightId, segments]) => {
        const optionId = segments[0]?.optionId;
        const flightOption = flightOptionsMap.get(optionId);

        return {
          flightId: `${flightId}`,
          segments,
          flightOption,
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

    const groupedReturnFlight = Object.entries(groupedReturnSegments).map(
      ([flightId, segments]) => {
        const optionId = segments[0]?.optionId;
        const flightOption = flightOptionsMap.get(optionId);

        return {
          flightId: `${flightId}`,
          segments,
          flightOption,
        };
      },
    );

    return new AbroadFlightScheduleDto(groupedFlight, groupedReturnFlight);
  };

  public parsePullPriceOfFlightResponse = (
    response: PlanePullPriceResponse,
  ): PlanePullPriceFlightDto => {
    const extractedResult = this.biletAllParser.extractResult(response);
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
    const extractedResult = this.biletAllParser.extractResult(response);
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
    const extractedResult = this.biletAllParser.extractResult(response);
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
    const extractedResult = this.biletAllParser.extractResult(response);
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
