import { Injectable } from '@nestjs/common';
import {
  PlaneAirport,
  PlaneAirportResponse,
} from './types/biletall-plane-airport.type';
import { BiletAllParser } from '../../../bus/services/biletall/biletall.parser';
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
  FlightOptionDto,
  FlightSegmentDto,
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
  CompanyPassengerAgeRule,
  CompanyPassengerAgeRulesResponse,
} from './types/plane-biletall-company-passanger-age-rules.type';
import { CompanyPassengerAgeRuleDto } from '../../dto/plane-company-passanger-age-rule.dto';

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
    const flightOptions = flightOptionsDataSet.map((entry) => {
      const flightOptionParsed: FlightOption = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightOptionParsed[key] = value;
      }
      return new FlightOptionDto(flightOptionParsed);
    });

    const flightSegmentsDataSet = newDataSet['Segmentler'] ?? [];
    const flightSegments = flightSegmentsDataSet.map((entry) => {
      const flightSegmentParsed: FlightSegment = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightSegmentParsed[key] = value;
      }
      return new FlightSegmentDto(flightSegmentParsed);
    });

    const segmentClassesDataSet = newDataSet['SegmentSiniflar'] ?? [];
    const segmentClasses = segmentClassesDataSet.map((entry) => {
      const segmentClassParsed: SegmentClass = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        segmentClassParsed[key] = value;
      }
      return new SegmentClassDto(segmentClassParsed);
    });

    const optionFaresDataSet = newDataSet['SecenekUcretler'] ?? [];
    const optionFares = optionFaresDataSet.map((entry) => {
      const optionFareParsed: OptionFare = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        optionFareParsed[key] = value;
      }
      return new OptionFareDto(optionFareParsed);
    });

    const optionFareDetailsDataSet = newDataSet['SecenekUcretDetaylar'] ?? [];
    const optionFareDetails = optionFareDetailsDataSet.map((entry) => {
      const optionFareDetailParsed: OptionFareDetail = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        optionFareDetailParsed[key] = value;
      }
      return new OptionFareDetailDto(optionFareDetailParsed);
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
      return new FlightSegmentDto(flightSegmentParsed);
    });

    return new DomesticFlightScheduleDto(
      flightOptions,
      flightSegments,
      segmentClasses,
      optionFares,
      optionFareDetails,
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

  public parsePassangerAgeRule = (
    response: CompanyPassengerAgeRulesResponse,
  ): CompanyPassengerAgeRuleDto[] => {
    const extractedResult = this.biletAllParser.extractResult(response);
    const PassangerAgeRules =
      extractedResult['TasiyiciFirmaYolcuYasKurallar'][0];
    const PassangerAgeRule = PassangerAgeRules['TasiyiciFirmaYolcuYasKural'];

    return PassangerAgeRule.map((entry) => {
      const PassangerAgeRuleParsed: CompanyPassengerAgeRule = Object.assign({});
      for (const [key, [value]] of Object.entries(entry)) {
        PassangerAgeRuleParsed[key] = value;
      }
      return new CompanyPassengerAgeRuleDto(PassangerAgeRuleParsed);
    });
  };
}
