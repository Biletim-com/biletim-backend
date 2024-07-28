import { Injectable } from '@nestjs/common';

import { ObjectTyped } from '@app/common/utils/object-typed.util';
import { BiletAllResponseError } from '@app/common/errors/biletall/biletall-response.error';

// types
import { SoapEnvelope } from './types/biletall-bus-soap-envelope.type';
import { ErrorResponse } from './types/biletall-bus-error.type';
import { BusFeature } from './types/biletall-bus-bus-feature.type';
import { ActionResult } from './types/biletall-bus-action-result.type';
import {
  BiletAllCompany,
  BiletAllCompanyResponse,
} from './types/biletall-bus-company';
import {
  BiletAllStopPoint,
  BiletAllStopPointResponse,
} from './types/biletall-bus-stop-points.type';
import {
  BusSchedule,
  BusScheduleResponse,
} from './types/biletall-bus-trip-search.type';
import {
  BusResponse,
  BusTrip,
  PaymentRule,
  Seat,
  TravelType,
} from './types/biletall-bus-bus-search.type';
import { BusSeatAvailabilityResponse } from './types/biletall-bus-but-seat-availability.type';
import {
  RouteDetail,
  RouteDetailResponse,
} from './types/biletall-bus-route.type';

@Injectable()
export class BiletAllBusParser {
  private isErrorResponse(response: any): response is ErrorResponse {
    return (
      Array.isArray(response?.IslemSonuc) &&
      response.IslemSonuc.some((islemSonuc: ActionResult) =>
        Array.isArray(islemSonuc.Hata),
      )
    );
  }

  private extractResult<T>(response: SoapEnvelope<T>): T {
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
  ): BiletAllCompany[] => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table = newDataSet['Table'];

    return table.map((entry) => {
      const companyParsed: BiletAllCompany = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        companyParsed[key] = value;
      }
      return companyParsed;
    });
  };

  public parseStopPoints = (
    response: BiletAllStopPointResponse,
  ): BiletAllStopPoint[] => {
    const extractedResult = this.extractResult(response);
    const karaNoktalar = extractedResult['KaraNoktalar'][0];
    const karaNoktaList = karaNoktalar['KaraNokta'];

    return karaNoktaList.map((entry) => {
      const stopPointParsed: BiletAllStopPoint = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        stopPointParsed[key] = value;
      }
      return stopPointParsed;
    });
  };

  public parseBusSchedule = (
    response: BusScheduleResponse,
  ): { schedules: BusSchedule[]; features: BusFeature[] } => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table = newDataSet['Table'];
    const oTipOzellik = newDataSet['OTipOzellik'];

    const schedules = table.map((entry) => {
      const scheduleParsed: BusSchedule = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        scheduleParsed[key] = value;
      }
      return scheduleParsed;
    });

    const features = oTipOzellik.map((entry) => {
      const featureParsed: BusFeature = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        featureParsed[key] = value;
      }

      return featureParsed as BusFeature;
    });

    return { schedules, features };
  };

  public parseBusResponse = (
    response: BusResponse,
  ): {
    trips: BusTrip[];
    seats: Seat[];
    travelTypes: TravelType[];
    features: BusFeature[];
    paymentRules: PaymentRule[];
  } => {
    const extractedResult = this.extractResult(response);
    const otobus = extractedResult['Otobus'][0];

    const trips = otobus['Sefer'].map((entry) => {
      const tripParsed: BusTrip = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        tripParsed[key] = value;
      }
      return tripParsed;
    });

    const seats = otobus['Koltuk'].map((entry) => {
      const seatParsed: Seat = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        seatParsed[key] = value;
      }
      return seatParsed;
    });

    const travelTypes = otobus['SeyahatTipleri'].map((entry) => {
      const travelTypeParsed: TravelType = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        travelTypeParsed[key] = value;
      }
      return travelTypeParsed;
    });

    const features = otobus['OTipOzellik'].map((entry) => {
      const featureParsed: BusFeature = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        featureParsed[key] = value;
      }
      return featureParsed;
    });

    const paymentRules = otobus['OdemeKurallari'].map((entry) => {
      const paymentRuleParsed: PaymentRule = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        paymentRuleParsed[key] = value;
      }
      return paymentRuleParsed;
    });

    return {
      trips,
      seats,
      travelTypes,
      features,
      paymentRules,
    };
  };

  public parseBusSeatAvailability = (
    response: BusSeatAvailabilityResponse,
  ): boolean => {
    const extractedResult = this.extractResult(response);
    const islemSonuc = extractedResult['IslemSonuc'][0];
    return islemSonuc['Sonuc'][0] === 'true';
  };

  public parseRouteDetail = (response: RouteDetailResponse): RouteDetail[] => {
    const extractedResult = this.extractResult(response);
    const newDataSet = extractedResult['NewDataSet'][0];
    const table1 = newDataSet['Table1'];

    return table1.map((entry) => {
      const routeDetailParsed: RouteDetail = Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(entry)) {
        routeDetailParsed[key] = value;
      }
      return routeDetailParsed;
    });
  };
}
