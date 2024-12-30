import { Injectable } from '@nestjs/common';

// services
import { BiletAllParserService } from '../../services/biletall-response-parser.service';

// dto
import { PlaneTicketReturnPenaltyDto } from '../dto/plane-ticket-return-penalty.dto';
import { PlaneTicketReturnDto } from '../dto/plane-ticket-return.dto';

// types
import {
  PlaneTicketReturnPenaltyPassenger,
  PlaneTicketReturnPenaltyResponse,
} from '../types/bilatall-plane-ticket-return-penalty.type';
import {
  PlaneTicketReturn,
  PlaneTicketReturnResponse,
} from '../types/bilatall-plane-ticket-return.type';

// utils
import { ObjectTyped } from '@app/common/utils';

@Injectable()
export class BiletAllPlaneTicketReturnParserService extends BiletAllParserService {
  public parseReturnPlaneTicketPenalty(
    response: PlaneTicketReturnPenaltyResponse,
  ): PlaneTicketReturnPenaltyDto {
    const extractedResult = this.extractResult(response);

    const returnPenalty = extractedResult['SatisIptalCeza'][0];
    const result = returnPenalty['Pnr'][0];
    const pnrNumber = result['PnrNo'][0];
    const passengers = result['Yolcular'][0]['Yolcu'];

    const planeTicketReturnPenaltyPassengersParsed: PlaneTicketReturnPenaltyPassenger[] =
      [];
    passengers.forEach((passenger) => {
      const planeTicketReturnPenaltyPassengerParsed: PlaneTicketReturnPenaltyPassenger =
        Object.assign({});
      for (const [key, [value]] of ObjectTyped.entries(passenger)) {
        planeTicketReturnPenaltyPassengerParsed[key] = value;
      }
      planeTicketReturnPenaltyPassengersParsed.push(
        planeTicketReturnPenaltyPassengerParsed,
      );
    });

    return new PlaneTicketReturnPenaltyDto(
      pnrNumber[0],
      planeTicketReturnPenaltyPassengersParsed,
    );
  }

  public parseReturnPlaneTicket(
    response: PlaneTicketReturnResponse,
  ): PlaneTicketReturnDto {
    const extractedResult = this.extractResult(response);
    const result = extractedResult['IslemSonuc'][0];

    const planeTicketReturnParsed: PlaneTicketReturn = Object.assign({});
    for (const [key, value] of ObjectTyped.entries(result)) {
      if (Array.isArray(value)) {
        planeTicketReturnParsed[key] = value[0];
      }
    }
    return new PlaneTicketReturnDto(planeTicketReturnParsed);
  }
}
