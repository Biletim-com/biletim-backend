import { Injectable } from '@nestjs/common';

import { ObjectTyped } from '@app/common/utils/object-typed.util';
import { BiletAllResponseError } from '@app/common/errors/biletall/biletall-response.error';

// types
import { SoapEnvelope } from './types/biletall-soap-envelope.type';
import { ErrorResponse } from './types/biletall-error.type';
import { BusFeature } from './types/biletall-bus-feature.type';
import { ActionResult } from './types/biletall-action-result.type';
import {
  BiletAllCompany,
  BiletAllCompanyResponse,
} from './types/biletall-company.type';
import {
  BusTerminal,
  BusStopPointResponse,
} from './types/biletall-bus-stop-points.type';
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

// dto
import { BusRouteDetailDto } from '../../dto/bus-route.dto';
import { ServiceInformationDto } from '../../dto/bus-service-information.dto';
import { BoardingPointDto } from '../../dto/bus-boarding-point.dto';
import { BusSeatAvailabilityDto } from '../../dto/bus-seat-availability.dto';
import { BusCompanyDto } from '../../dto/bus-company.dto';
import {
  BusFeaturesDto,
  BusSearchDto,
  BusSeatDto,
  BusTravelTypeDto,
  BusTripDto,
  CompanyPaymentRulesDto,
} from '../../dto/bus-search.dto';
import {
  BusScheduleDto,
  BusScheduleAndBusFeaturesDto,
} from '../../dto/bus-schedule-list.dto';
import { BusTerminalDto } from '../../dto/bus-terminal.dto';

@Injectable()
export class BiletAllParser {
  public isErrorResponse(response: any): response is ErrorResponse {
    return (
      Array.isArray(response?.IslemSonuc) &&
      response.IslemSonuc.some((islemSonuc: ActionResult) =>
        Array.isArray(islemSonuc.Hata),
      )
    );
  }

  public extractResult<T>(response: SoapEnvelope<T>): T {
    const envelope = response['soap:Envelope'];
    const body = envelope['soap:Body'][0];
    const xmlIsletResponse = body['XmlIsletResponse'][0];
    const result = xmlIsletResponse['XmlIsletResult'][0];

    if (this.isErrorResponse(result)) {
      const errorMessage =
        result.IslemSonuc[0]?.Hata?.[0] ||
        'Something went wrong with the Soap client';
      throw new BiletAllResponseError(errorMessage);
    }

    return result;
  }

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
  ): BusScheduleAndBusFeaturesDto => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table = newDataSet['Table'];
    const typeFeatures = newDataSet['OTipOzellik'];

    const schedules = table.map((entry) => {
      const scheduleParsed: BusSchedule = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        scheduleParsed[key] = value;
      }
      return new BusScheduleDto(scheduleParsed);
    });

    const features = typeFeatures.map((entry) => {
      const featureParsed: BusFeature = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        featureParsed[key] = value;
      }

      return new BusFeaturesDto(featureParsed);
    });

    return new BusScheduleAndBusFeaturesDto(schedules, features);
  };

  public parseBusSearchResponse = (response: BusResponse): BusSearchDto => {
    const extractedResult = this.extractResult(response);
    const bus = extractedResult['Otobus'][0];

    const tripParsed: BusTrip = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(bus['Sefer'][0])) {
      tripParsed[key] = value;
    }
    const trip = new BusTripDto(tripParsed);

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

    const features = bus['OTipOzellik'].map((entry) => {
      const featureParsed: BusFeature = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        featureParsed[key] = value;
      }
      return new BusFeaturesDto(featureParsed);
    });

    const paymentRuleParsed: PaymentRule = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(
      bus['OdemeKurallari'][0],
    )) {
      paymentRuleParsed[key] = value;
    }
    const paymentRules = new CompanyPaymentRulesDto(paymentRuleParsed);

    return new BusSearchDto(trip, seats, travelTypes, features, paymentRules);
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
}
