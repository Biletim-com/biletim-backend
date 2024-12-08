import { Injectable } from '@nestjs/common';

// services
import { BiletAllParserService } from '../../services/biletall-response-parser.service';

// dto
import { BusTicketReturnDto } from '../dto/bus-ticket-return.dto';

// types
import {
  BusTicketReturn,
  BusTicketReturnResponse,
} from '../types/biletall-bus-ticket-return.type';

// utils
import { ObjectTyped } from '@app/common/utils';

@Injectable()
export class BiletAllBusTicketReturnParserService extends BiletAllParserService {
  public parseReturnBusTicket(
    response: BusTicketReturnResponse,
  ): BusTicketReturnDto {
    const extractedResult = this.extractResult(response);
    const result = extractedResult['IslemSonuc'][0];

    const busTicketReturnParsed: BusTicketReturn = Object.assign({});
    for (const [key, value] of ObjectTyped.entries(result)) {
      if (Array.isArray(value)) {
        busTicketReturnParsed[key] = value[0];
      }
    }
    return new BusTicketReturnDto(busTicketReturnParsed);
  }
}
