import { Injectable } from '@nestjs/common';
import {
  PlaneAirPoint,
  PlaneAirPointResponse,
} from './types/biletall-plane-air-points.type';
import { BiletAllParser } from '../../../bus/services/biletall/biletall.parser';
import { PlaneAirPointDto } from '../../dto/plane-air-points.dto';
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

@Injectable()
export class BiletallPlaneParser {
  constructor(private readonly biletAllParser: BiletAllParser) {}

  public parseAirPoints = (
    response: PlaneAirPointResponse,
  ): PlaneAirPointDto[] => {
    const extractedResult = this.biletAllParser.extractResult(response);
    const havaNoktalar = extractedResult['HavaNoktalar'][0];
    const havaNoktaList = havaNoktalar['HavaNokta'];

    return havaNoktaList.map((entry) => {
      const airPointParsed: PlaneAirPoint = Object.assign({});
      for (const [key, [value]] of Object.entries(entry)) {
        airPointParsed[key] = value;
      }
      return new PlaneAirPointDto(airPointParsed);
    });
  };

  public parseDomesticFlightResponse = (
    response: DomesticFlightResponse,
  ): DomesticFlightScheduleDto => {
    const extractedResult = this.biletAllParser.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];

    const gidisSecenekler = newDataSet['Secenekler'] ?? [];

    const flightOptions = gidisSecenekler.map((entry: any) => {
      const flightOptionParsed: Partial<FlightOption> = {};
      Object.entries(entry).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          flightOptionParsed[key as keyof FlightOption] = value[0];
        }
      });
      return new FlightOptionDto(flightOptionParsed as FlightOption);
    });

    const gidisSegmentler = newDataSet['Segmentler'] ?? [];
    const flightSegments = gidisSegmentler.map((entry: any) => {
      const flightSegmentParsed: Partial<FlightSegment> = {};
      Object.entries(entry).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          flightSegmentParsed[key as keyof FlightSegment] = value[0];
        }
      });
      return new FlightSegmentDto(flightSegmentParsed as FlightSegment);
    });

    const segmentSiniflar = newDataSet['SegmentSiniflar'] ?? [];
    const segmentClasses = segmentSiniflar.map((entry: any) => {
      const segmentClassParsed: Partial<SegmentClass> = {};
      Object.entries(entry).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          segmentClassParsed[key as keyof SegmentClass] = value[0];
        }
      });
      return new SegmentClassDto(segmentClassParsed as SegmentClass);
    });

    const secenekUcretler = newDataSet['SecenekUcretler'] ?? [];
    const optionFares = secenekUcretler.map((entry: any) => {
      const optionFareParsed: Partial<OptionFare> = {};
      Object.entries(entry).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          optionFareParsed[key as keyof OptionFare] = value[0];
        }
      });
      return new OptionFareDto(optionFareParsed as OptionFare);
    });

    const secenekUcretDetaylar = newDataSet['SecenekUcretDetaylar'] ?? [];
    const optionFareDetails = secenekUcretDetaylar.map((entry: any) => {
      const optionFareDetailParsed: Partial<OptionFareDetail> = {};
      Object.entries(entry).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          optionFareDetailParsed[key as keyof OptionFareDetail] = value[0];
        }
      });
      return new OptionFareDetailDto(
        optionFareDetailParsed as OptionFareDetail,
      );
    });

    const donusSecenekler = newDataSet['DonusSecenekler'] ?? [];

    const returnFlightOptions = donusSecenekler.map((entry: any) => {
      const flightOptionParsed: Partial<FlightOption> = {};
      Object.entries(entry).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          flightOptionParsed[key as keyof FlightOption] = value[0];
        }
      });
      return new FlightOptionDto(flightOptionParsed as FlightOption);
    });

    const donusSegmentler = newDataSet['DonusSegmentler'] ?? [];
    const returnFlightSegments = donusSegmentler.map((entry: any) => {
      const flightSegmentParsed: Partial<FlightSegment> = {};
      Object.entries(entry).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          flightSegmentParsed[key as keyof FlightSegment] = value[0];
        }
      });
      return new FlightSegmentDto(flightSegmentParsed as FlightSegment);
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
}
