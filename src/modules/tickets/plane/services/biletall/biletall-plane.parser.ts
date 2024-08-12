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

@Injectable()
export class BiletallPlaneParser {
  constructor(private readonly biletAllParser: BiletAllParser) {}

  public parseAirport = (response: PlaneAirportResponse): PlaneAirportDto[] => {
    const extractedResult = this.biletAllParser.extractResult(response);
    const havaNoktalar = extractedResult['HavaNoktalar'][0];
    const havaNoktaList = havaNoktalar['HavaNokta'];

    return havaNoktaList.map((entry) => {
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

    const gidisSecenekler = newDataSet['Secenekler'] ?? [];
    const flightOptions = gidisSecenekler.map((entry: any) => {
      const flightOptionParsed: FlightOption = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightOptionParsed[key] = value;
      }
      return new FlightOptionDto(flightOptionParsed);
    });

    const gidisSegmentler = newDataSet['Segmentler'] ?? [];
    const flightSegments = gidisSegmentler.map((entry: any) => {
      const flightSegmentParsed: FlightSegment = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightSegmentParsed[key] = value;
      }
      return new FlightSegmentDto(flightSegmentParsed);
    });

    const segmentSiniflar = newDataSet['SegmentSiniflar'] ?? [];
    const segmentClasses = segmentSiniflar.map((entry: any) => {
      const segmentClassParsed: SegmentClass = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        segmentClassParsed[key] = value;
      }
      return new SegmentClassDto(segmentClassParsed);
    });

    const secenekUcretler = newDataSet['SecenekUcretler'] ?? [];
    const optionFares = secenekUcretler.map((entry: any) => {
      const optionFareParsed: OptionFare = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        optionFareParsed[key] = value;
      }
      return new OptionFareDto(optionFareParsed);
    });

    const secenekUcretDetaylar = newDataSet['SecenekUcretDetaylar'] ?? [];
    const optionFareDetails = secenekUcretDetaylar.map((entry: any) => {
      const optionFareDetailParsed: OptionFareDetail = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        optionFareDetailParsed[key] = value;
      }
      return new OptionFareDetailDto(optionFareDetailParsed);
    });

    const donusSecenekler = newDataSet['DonusSecenekler'] ?? [];
    const returnFlightOptions = donusSecenekler.map((entry: any) => {
      const flightOptionParsed: FlightOption = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightOptionParsed[key] = value;
      }
      return new FlightOptionDto(flightOptionParsed);
    });

    const donusSegmentler = newDataSet['DonusSegmentler'] ?? [];
    const returnFlightSegments = donusSegmentler.map((entry: any) => {
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

    const gidisSecenekler = newDataSet['Secenekler'] ?? [];
    const flightOptions = gidisSecenekler.map((entry: any) => {
      const flightOptionParsed: AbroadFlightOption = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightOptionParsed[key] = value;
      }
      return new AbroadFlightOptionDto(flightOptionParsed);
    });

    const gidisSegmentler = newDataSet['Segmentler'] ?? [];
    const flightSegments = gidisSegmentler.map((entry: any) => {
      const flightSegmentParsed: AbroadFlightSegment = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightSegmentParsed[key] = value;
      }
      return new AbroadFlightSegmentDto(flightSegmentParsed);
    });

    const donusSegmentler = newDataSet['DonusSegmentler'] ?? [];
    const returnFlightSegments = donusSegmentler.map((entry: any) => {
      const flightSegmentParsed: AbroadFlightSegment = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        flightSegmentParsed[key] = value;
      }
      return new AbroadFlightSegmentDto(flightSegmentParsed);
    });

    return new AbroadFlightScheduleDto(
      flightOptions,
      flightSegments,
      returnFlightSegments,
    );
  };
}
