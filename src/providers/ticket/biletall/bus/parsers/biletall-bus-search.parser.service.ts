import { Injectable } from '@nestjs/common';

// services
import { BiletAllParserService } from '../../services/biletall-response-parser.service';

// types
import { BusFeature } from '../types/biletall-bus-feature.type';
import {
  BusTripSchedule,
  BusTripScheduleAndFeaturesResponse,
} from '../types/biletall-bus-trip-schedule.type';
import {
  BusResponse,
  BusTrip,
  PaymentRule,
  Seat,
  TravelType,
} from '../types/biletall-bus-search.type';
import { BusSeatAvailabilityResponse } from '../types/biletall-bus-seat-availability.type';
import {
  BusRouteDetail,
  BusRouteDetailResponse,
} from '../types/biletall-bus-route.type';
import {
  BusServiceInformation,
  BusServiceInformationResponse,
} from '../types/biletall-bus-service-information.type';
import {
  BusBoardingPoint,
  BusBoardingPointResponse,
} from '../types/biletall-bus-boarding-point.type';
import {
  BusCompany,
  BusCompaniesResponse,
} from '../types/biletall-bus-company.type';
import {
  BusTerminal,
  BusTerminalPointResponse,
} from '../types/biletall-bus-terminal.type';

// dto
import { BoardingPointDto } from '../dto/bus-boarding-point.dto';
import { BusCompanyDto } from '../dto/bus-company.dto';
import { BusRouteDetailDto } from '../dto/bus-route.dto';
import {
  BusScheduleListParserDto,
  BusScheduleDto,
  BusFeaturesDto,
} from '../dto/bus-schedule-list.dto';
import { BusSeatAvailabilityDto } from '../dto/bus-seat-availability.dto';
import { ServiceInformationDto } from '../dto/bus-service-information.dto';
import { BusTerminalDto } from '../dto/bus-terminal.dto';
import {
  BusDetailDto,
  BusTripDto,
  BusSeatDto,
  BusTravelTypeDto,
  CompanyPaymentRulesDto,
} from '../dto/bus-ticket-detail.dto';

// utils
import { ObjectTyped } from '@app/common/utils';

@Injectable()
export class BiletAllBusSearchParserService extends BiletAllParserService {
  public parseTripSchedule = (
    response: BusTripScheduleAndFeaturesResponse,
  ): BusScheduleListParserDto => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table = newDataSet['Table'];
    const typeFeatures = newDataSet['OTipOzellik'];

    const schedules = table.map((entry) => {
      const scheduleParsed: BusTripSchedule = Object.assign({});

      for (const [key, [value]] of Object.entries(entry)) {
        scheduleParsed[key] = value;
      }

      if (scheduleParsed.SeyahatSuresiGosterimTipi === '0') {
        scheduleParsed.SeyahatSuresi = 'Travel time should not be shown';
        delete scheduleParsed.YaklasikSeyahatSuresi;
      } else if (scheduleParsed.SeyahatSuresiGosterimTipi === '1') {
        if (scheduleParsed.YaklasikSeyahatSuresi) {
          scheduleParsed.YaklasikSeyahatSuresi += ' hour';
          delete scheduleParsed.SeyahatSuresi;
        }
      } else if (scheduleParsed.SeyahatSuresiGosterimTipi === '2') {
        const timeString = scheduleParsed.SeyahatSuresi;
        if (timeString) {
          const formattedTime = `${timeString.substring(11, 16)} hour`;
          scheduleParsed.SeyahatSuresi = formattedTime;
        }
        delete scheduleParsed.YaklasikSeyahatSuresi;
      }
      return new BusScheduleDto(scheduleParsed);
    });

    const features = typeFeatures.map((entry) => {
      const featureParsed: BusFeature = Object.assign({});
      for (const [key, [value]] of Object.entries(entry)) {
        featureParsed[key] = value;
      }
      return new BusFeaturesDto(featureParsed);
    });

    const SchedulesAndFeatures = schedules.map((schedule) => {
      const featureIndexes = schedule.busTypeFeature
        ? schedule.busTypeFeature
            .split('')
            .map((value, index) => (value === '1' ? index : -1))
            .filter((index) => index !== -1)
        : [];
      const relatedFeatures = featureIndexes.map((index) => features[index]);

      return {
        schedule,
        features: relatedFeatures,
      };
    });

    return new BusScheduleListParserDto(SchedulesAndFeatures);
  };

  public parseCompany = (response: BusCompaniesResponse): BusCompanyDto[] => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table = newDataSet['Table'];

    return table.map((entry) => {
      const companyParsed: BusCompany = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        companyParsed[key] = value;
      }
      return new BusCompanyDto(companyParsed);
    });
  };

  public parseBusTerminals = (
    response: BusTerminalPointResponse,
  ): BusTerminalDto[] => {
    const extractedResult = this.extractResult(response);
    const busTerminals = extractedResult['KaraNoktalar'][0];
    const busTerminal = busTerminals['KaraNokta'];

    return busTerminal.map((entry) => {
      const stopPointParsed: BusTerminal = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        stopPointParsed[key] = value;
      }
      return new BusTerminalDto(stopPointParsed);
    });
  };

  public parseBusDetails = (response: BusResponse): BusDetailDto => {
    const extractedResult = this.extractResult(response);
    const bus = extractedResult['Otobus'][0];

    const busTripParsed: BusTrip = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(bus['Sefer'][0])) {
      busTripParsed[key] = value;
    }

    const busTrip = new BusTripDto(busTripParsed);

    const seats = bus['Koltuk'].map((entry) => {
      const seatParsed: Seat = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        seatParsed[key] = value;
      }
      return new BusSeatDto(seatParsed);
    });

    const travelTypes = bus['SeyahatTipleri'].map((entry) => {
      const travelTypeParsed: TravelType = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        travelTypeParsed[key] = value;
      }
      return new BusTravelTypeDto(travelTypeParsed);
    });

    const paymentRuleParsed: PaymentRule = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(
      bus['OdemeKurallari'][0],
    )) {
      paymentRuleParsed[key] = value;
    }
    const paymentRules = new CompanyPaymentRulesDto(paymentRuleParsed);

    return new BusDetailDto(busTrip, seats, travelTypes, paymentRules);
  };

  public parseBusSeatAvailability = (
    response: BusSeatAvailabilityResponse,
  ): BusSeatAvailabilityDto => {
    const extractedResult = this.extractResult(response);
    const transactionResult = extractedResult['IslemSonuc'][0];
    return new BusSeatAvailabilityDto(transactionResult['Sonuc'][0] === 'true');
  };

  public parseBoardingPoint = (
    response: BusBoardingPointResponse,
  ): BoardingPointDto[] => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table = newDataSet['Table'];

    return table.map((entry) => {
      const boardingBointsParsed: BusBoardingPoint = Object.assign({});
      for (const [key, [value]] of Object.entries(entry)) {
        boardingBointsParsed[key] = value;
      }
      return new BoardingPointDto(boardingBointsParsed);
    });
  };

  public parseServiceInformation = (
    response: BusServiceInformationResponse,
  ): ServiceInformationDto[] => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table = newDataSet['Table'];

    return table.map((entry) => {
      const serviceInformationParsed: BusServiceInformation = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        serviceInformationParsed[key] = value;
      }
      return new ServiceInformationDto(serviceInformationParsed);
    });
  };

  public parseRouteDetail = (
    response: BusRouteDetailResponse,
  ): BusRouteDetailDto[] => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table1 = newDataSet['Table1'];

    return table1.map((entry) => {
      const routeDetailParsed: BusRouteDetail = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        routeDetailParsed[key] = value;
      }
      return new BusRouteDetailDto(routeDetailParsed);
    });
  };
}
