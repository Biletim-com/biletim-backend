import { Injectable } from '@nestjs/common';
import {
  PlaneAirPoint,
  PlaneAirPointResponse,
} from './types/biletall-plane-air-points.type';
import { BiletAllParser } from '../../../bus/services/biletall/biletall.parser';
import { PlaneAirPointDto } from '../../dto/plane-air-points.dto';
import { DomesticFlightResponse } from './types/biletall-plane-domistic-flight-schedule.type';

@Injectable()
export class BiletallPlaneParser {
  constructor(private readonly biletAllParser: BiletAllParser) {}

  public parseAirPoints = (
    response: PlaneAirPointResponse,
  ): PlaneAirPointDto[] => {
    const extractedResult = this.biletAllParser.extractResult(response);
    console.log(extractedResult);
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

  // public parseDomesticFlightResponse = (
  //   response: DomesticFlightResponse,
  // ): {
  //   flightOptions: FlightOptionDto[];
  //   flightSegments: FlightSegmentDto[];
  //   segmentClasses: SegmentClassDto[];
  //   optionFares: OptionFareDto[];
  //   optionFareDetails: OptionFareDetailDto[];
  // } => {
  //   const extractedResult = this.biletAllParser.extractResult(response);

  //   // Parsing flight options
  //   const gidisSecenekler = extractedResult['GidisSecenekler'][0];
  //   const gidisSecenekList = gidisSecenekler['Secenek'];
  //   const flightOptions = gidisSecenekList.map((entry) => {
  //     const flightOptionParsed: FlightOption = Object.assign({});
  //     for (const [key, [value]] of Object.entries(entry)) {
  //       flightOptionParsed[key] = value;
  //     }
  //     return new FlightOptionDto(flightOptionParsed);
  //   });

  //   // Parsing flight segments
  //   const gidisSegmentler = extractedResult['GidisSegmentler'][0];
  //   const gidisSegmentList = gidisSegmentler['Segment'];
  //   const flightSegments = gidisSegmentList.map((entry) => {
  //     const flightSegmentParsed: FlightSegment = Object.assign({});
  //     for (const [key, [value]] of Object.entries(entry)) {
  //       flightSegmentParsed[key] = value;
  //     }
  //     return new FlightSegmentDto(flightSegmentParsed);
  //   });

  //   // Parsing segment classes
  //   const segmentSiniflar = extractedResult['SegmentSiniflar'][0];
  //   const segmentSinifList = segmentSiniflar['Sinif'];
  //   const segmentClasses = segmentSinifList.map((entry) => {
  //     const segmentClassParsed: SegmentClass = Object.assign({});
  //     for (const [key, [value]] of Object.entries(entry)) {
  //       segmentClassParsed[key] = value;
  //     }
  //     return new SegmentClassDto(segmentClassParsed);
  //   });

  //   // Parsing option fares
  //   const secenekUcretler = extractedResult['SecenekUcretler'][0];
  //   const secenekUcretList = secenekUcretler['Ucret'];
  //   const optionFares = secenekUcretList.map((entry) => {
  //     const optionFareParsed: OptionFare = Object.assign({});
  //     for (const [key, [value]] of Object.entries(entry)) {
  //       optionFareParsed[key] = value;
  //     }
  //     return new OptionFareDto(optionFareParsed);
  //   });

  //   // Parsing option fare details
  //   const secenekUcretDetaylar = extractedResult['SecenekUcretDetaylar'][0];
  //   const secenekUcretDetayList = secenekUcretDetaylar['Detay'];
  //   const optionFareDetails = secenekUcretDetayList.map((entry) => {
  //     const optionFareDetailParsed: OptionFareDetail = Object.assign({});
  //     for (const [key, [value]] of Object.entries(entry)) {
  //       optionFareDetailParsed[key] = value;
  //     }
  //     return new OptionFareDetailDto(optionFareDetailParsed);
  //   });

  //   return {
  //     flightOptions,
  //     flightSegments,
  //     segmentClasses,
  //     optionFares,
  //     optionFareDetails,
  //   };
  // };
}
