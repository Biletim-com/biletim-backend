import { Injectable } from '@nestjs/common';

import { BiletAllParserService } from '../../services/biletall-response-parser.service';

// dto
import { FlightTicketPurchaseDto } from '../dto/plane-ticket-purchase.dto';
import { FlightTicketReservationDto } from '../dto/plane-ticket-reservation.dto';

import {
  FlightTicketPurchaseResult,
  PlaneTicketPurchaseResponse,
} from '../types/biletall-plane-ticket-purchase.type';
import {
  FlightTicketReservationResult,
  PlaneTicketReservationResponse,
} from '../types/biletall-plane-ticket-reservation.type';

@Injectable()
export class BiletAllPlaneTicketPurchaseParserService extends BiletAllParserService {
  public parseFlightTicketReservation = (
    response: PlaneTicketReservationResponse,
  ): FlightTicketReservationDto => {
    const extractedResult = this.extractResult(response);
    const ticketResult = extractedResult['IslemSonuc'][0];

    const reservationParsed: FlightTicketReservationResult = Object.assign({});
    for (const [key, value] of Object.entries(ticketResult)) {
      if (Array.isArray(value)) {
        reservationParsed[key] = value[0];
      }
    }

    return new FlightTicketReservationDto(reservationParsed);
  };

  public parseFlightTicketPurchase = (
    response: PlaneTicketPurchaseResponse,
  ): FlightTicketPurchaseDto => {
    const extractedResult = this.extractResult(response);
    const ticketResult = extractedResult['IslemSonuc'][0];

    const saleResultParsed: FlightTicketPurchaseResult = Object.assign({});
    for (const [key, value] of Object.entries(ticketResult)) {
      if (Array.isArray(value)) {
        saleResultParsed[key] = value[0];
      }
    }

    return new FlightTicketPurchaseDto(saleResultParsed);
  };
}
