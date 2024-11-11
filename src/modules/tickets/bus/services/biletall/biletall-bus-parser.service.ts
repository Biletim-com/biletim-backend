import { Injectable } from '@nestjs/common';

import { ObjectTyped } from '@app/common/utils/object-typed.util';

// services
import { BiletAllParserService } from '@app/common/services';

// types
import { BusFeature } from './types/biletall-bus-feature.type';
import {
  BiletAllCompany,
  BiletAllCompanyResponse,
} from './types/biletall-company.type';
import {
  BusTerminal,
  BusStopPointResponse,
} from './types/biletall-bus-terminal.type';
import {
  BusSchedule,
  BusScheduleAndFeaturesResponse,
} from './types/biletall-trip-search.type';
import {
  BusResponse,
  BusTrip,
  PaymentRule,
  Seat,
  TravelType,
} from './types/biletall-bus-search.type';
import { BusSeatAvailabilityResponse } from './types/biletall-bus-seat-availability.type';
import { RouteDetail, RouteDetailResponse } from './types/biletall-route.type';
import {
  ServiceInformation,
  ServiceInformationResponse,
} from './types/biletall-service-information.type';
import {
  BoardingPoint,
  BoardingPointResponse,
} from './types/biletall-boarding-point.type';
import {
  BusTicketSaleRequest,
  BusTicketSaleRequestResponse,
} from './types/biletall-sale-request.type';

// dto
import { BusRouteDetailDto } from '../../dto/bus-route.dto';
import { ServiceInformationDto } from '../../dto/bus-service-information.dto';
import { BoardingPointDto } from '../../dto/bus-boarding-point.dto';
import { BusSeatAvailabilityDto } from '../../dto/bus-seat-availability.dto';
import { BusCompanyDto } from '../../dto/bus-company.dto';
import {
  BusDetailDto,
  BusSeatDto,
  BusTravelTypeDto,
  BusTripDto,
  CompanyPaymentRulesDto,
} from '../../dto/bus-ticket-detail.dto';
import {
  BusFeaturesDto,
  BusScheduleDto,
  BusScheduleListParserDto,
} from '../../dto/bus-schedule-list.dto';
import { BusTerminalDto } from '../../dto/bus-terminal.dto';
import { BusTicketSaleDto } from '../../dto/bus-ticket-sale.dto';

@Injectable()
export class BiletAllBusParserService extends BiletAllParserService {
  public parseCompany = (
    response: BiletAllCompanyResponse,
  ): BusCompanyDto[] => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table = newDataSet['Table'];

    return table.map((entry) => {
      const companyParsed: BiletAllCompany = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        companyParsed[key] = value;
      }
      return new BusCompanyDto(companyParsed);
    });
  };

  public parseBusTerminals = (
    response: BusStopPointResponse,
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

  public parseBusSchedule = (
    response: BusScheduleAndFeaturesResponse,
  ): BusScheduleListParserDto => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table = newDataSet['Table'];
    const typeFeatures = newDataSet['OTipOzellik'];

    const schedules = table.map((entry) => {
      const scheduleParsed: BusSchedule = Object.assign({});

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

  public parseBusDetailResponse = (response: BusResponse): BusDetailDto => {
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
    response: BoardingPointResponse,
  ): BoardingPointDto[] => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table = newDataSet['Table'];

    return table.map((entry) => {
      const boardingBointsParsed: BoardingPoint = Object.assign({});
      for (const [key, [value]] of Object.entries(entry)) {
        boardingBointsParsed[key] = value;
      }
      return new BoardingPointDto(boardingBointsParsed);
    });
  };

  public parseServiceInformation = (
    response: ServiceInformationResponse,
  ): ServiceInformationDto[] => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table = newDataSet['Table'];

    return table.map((entry) => {
      const serviceInformationParsed: ServiceInformation = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        serviceInformationParsed[key] = value;
      }
      return new ServiceInformationDto(serviceInformationParsed);
    });
  };

  public parseRouteDetail = (
    response: RouteDetailResponse,
  ): BusRouteDetailDto[] => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table1 = newDataSet['Table1'];

    return table1.map((entry) => {
      const routeDetailParsed: RouteDetail = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        routeDetailParsed[key] = value;
      }
      return new BusRouteDetailDto(routeDetailParsed);
    });
  };

  public parseSaleRequest = (
    response: BusTicketSaleRequestResponse,
  ): BusTicketSaleDto => {
    const extractedResult = this.extractResult(response);
    const result = extractedResult['IslemSonuc'][0];

    const saleResultParsed = Object.assign({});
    for (const [key, value] of Object.entries(result)) {
      if (Array.isArray(value)) {
        saleResultParsed[key] = value[0];
      }
    }
    return new BusTicketSaleDto(saleResultParsed);
  };
}
