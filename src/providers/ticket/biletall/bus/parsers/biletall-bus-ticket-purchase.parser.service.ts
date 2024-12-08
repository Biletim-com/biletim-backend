import { Injectable } from '@nestjs/common';

// services
import { BiletAllParserService } from '../../services/biletall-response-parser.service';

// dtos
import {
  BusScheduleListParserDto,
  BusScheduleDto,
  BusFeaturesDto,
} from '../dto/bus-schedule-list.dto';
import { BusTicketPurchaseDto } from '../dto/bus-ticket-purchase.dto';

// types
import { BusFeature } from '../types/biletall-bus-feature.type';
import {
  BusTripSchedule,
  BusTripScheduleAndFeaturesResponse,
} from '../types/biletall-bus-trip-schedule.type';
import { BusTicketPurchaseRequestResponse } from '../types/biletall-bus-ticket-purchase.type';

@Injectable()
export class BiletAllBusTicketPurchaseParserService extends BiletAllParserService {
  public parseBusSchedule = (
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

  public parsePurchaseRequest = (
    response: BusTicketPurchaseRequestResponse,
  ): BusTicketPurchaseDto => {
    const extractedResult = this.extractResult(response);
    const result = extractedResult['IslemSonuc'][0];

    const saleResultParsed = Object.assign({});
    for (const [key, value] of Object.entries(result)) {
      if (Array.isArray(value)) {
        saleResultParsed[key] = value[0];
      }
    }
    return new BusTicketPurchaseDto(saleResultParsed);
  };
}
