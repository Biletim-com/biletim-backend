import { Injectable } from '@nestjs/common';

import { BiletAllParserService } from '../../services/biletall-response-parser.service';

// dto
import {
  InvoiceAbroadFlightDto,
  MembershipAbroadFlightDto,
  OpenTicketAbroadFlightDto,
  PassengerAbroadFlightDto,
  PaymentRulesAbroadFlightDto,
  PnrAbroadFlightDto,
  PnrExtraServiceSegmentAbroadFlightDto,
  PnrSearchAbroadFlightDto,
  SeatNumbersAbroadFlightDto,
  SegmentAbroadFlightDto,
} from '../dto/tickets-pnr-search-abroad-flight.dto';
import {
  AgencyPrepaymentDomesticFlightDto,
  CollectionDomesticFlightDto,
  CommissionDomesticFlightDto,
  InvoiceDomesticFlightDto,
  MembershipDomesticFlightDto,
  OpenTicketDomesticFlightDto,
  PassengerDomesticFlightDto,
  PnrDomesticFlightDto,
  PnrExtraServiceSegmentDomesticFlightDto,
  PnrSearchDomesticFlightDto,
  PnrTransactionDetailDomesticFlightDto,
  SeatNumbersDomesticFlightDto,
  SegmentDomesticFlightDto,
} from '../dto/tickets-pnr-search-domestic-flight.dto';

import {
  AgencyPrepaymentBusDto,
  CollectionBusDto,
  CommissionBusDto,
  InvoiceBusDto,
  MembershipBusDto,
  OpenTicketBusDto,
  PassengerBusDto,
  PnrBusDto,
  PnrExtraServiceSegmentBusDto,
  PnrSearchBusDto,
  PnrTransactionDetailBusDto,
  SeatNumbersBusDto,
  SegmentBusDto,
} from '../dto/tickets-pnr-search-bus.dto';

// types
import { PnrSearchResponse } from '../types/tickets-pnr-search-union.type';
import {
  AgencyPrepaymentBus,
  CollectionBus,
  CommissionBus,
  InvoiceBus,
  MembershipBus,
  OpenTicketBus,
  PassengerBus,
  PnrBus,
  PnrExtraServiceSegmentBus,
  PnrSearchBusDataSet,
  PnrTransactionDetailBus,
  SeatNumbersBus,
  SegmentBus,
} from '../types/tickets-pnr-search-bus-response.type';
import {
  InvoiceAbroadFlight,
  MembershipAbroadFlight,
  OpenTicketAbroadFlight,
  PassengerAbroadFlight,
  PaymentRulesAbroadFlight,
  PnrAbroadFlight,
  PnrExtraServiceSegmentAbroadFlight,
  PnrSearchAbroadFlightDataSet,
  SeatNumbersAbroadFlight,
  SegmentAbroadFlight,
} from '../types/tickets-pnr-search-abroad-flight-response.type';
import {
  AgencyPrepaymentDomesticFlight,
  CollectionDomesticFlight,
  CommissionDomesticFlight,
  InvoiceDomesticFlight,
  MembershipDomesticFlight,
  OpenTicketDomesticFlight,
  PassengerDomesticFlight,
  PnrDomesticFlight,
  PnrExtraServiceSegmentDomesticFlight,
  PnrSearchDomesticFlightDataSet,
  PnrTransactionDetailDomesticFlight,
  SeatNumbersDomesticFlight,
  SegmentDomesticFlight,
} from '../types/tickets-pnr-search-domestic-flight-response.type';

// utils
import { ObjectTyped } from '@app/common/utils/object-typed.util';

@Injectable()
export class BiletAllPnrParserService extends BiletAllParserService {
  private parsePnrSearchBusResponse = (
    extractedResult: PnrSearchBusDataSet,
  ): PnrSearchBusDto => {
    const ticket = extractedResult['Bilet'][0];

    const pnrResult = ticket['PNR'][0];
    const pnrParsed: PnrBus = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(pnrResult)) {
      pnrParsed[key] = value;
    }
    const pnr = new PnrBusDto(pnrParsed);

    const passengerResult = ticket['Yolcu'][0];
    const passengerParsed: PassengerBus = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(passengerResult)) {
      passengerParsed[key] = value;
    }
    const passenger = new PassengerBusDto(passengerParsed);

    const segmentResult = ticket['Segment'][0];
    const segmentParsed: SegmentBus = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(segmentResult)) {
      if (key === 'KalkisKod') {
        segmentParsed.KalkisKod = { KalkisKod: value };
      } else if (key === 'VarisKod') {
        segmentParsed.VarisKod = { VarisKod: value };
      } else {
        segmentParsed[key] = value;
      }
    }
    const segment = new SegmentBusDto(segmentParsed);

    const openTicketResult = ticket['AcikBilet'][0];
    const openTicketParsed: OpenTicketBus = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(openTicketResult)) {
      openTicketParsed[key] = value;
    }
    const openTicket = new OpenTicketBusDto(openTicketParsed);

    const membershipResult = ticket['Uyelik'][0];
    const membershipParsed: MembershipBus = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(membershipResult)) {
      membershipParsed[key] = value;
    }
    const membership = new MembershipBusDto(membershipParsed);

    const collectionResult = ticket['Tahsilat'][0];
    const collectionParsed: CollectionBus = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(collectionResult)) {
      collectionParsed[key] = value;
    }
    const collection = new CollectionBusDto(collectionParsed);

    const PnrTransactionDetailResult = ticket['PNRIslemDetay'][0];
    const pnrTransactionDetailParsed: PnrTransactionDetailBus = Object.assign(
      {},
    );
    for (const [key, [value]] of ObjectTyped.entries(
      PnrTransactionDetailResult,
    )) {
      pnrTransactionDetailParsed[key] = value;
    }
    const pnrTransactionDetail = new PnrTransactionDetailBusDto(
      pnrTransactionDetailParsed,
    );

    const invoiceResult = ticket['Fatura'][0];
    const invoiceParsed: InvoiceBus = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(invoiceResult)) {
      invoiceParsed[key] = value;
    }
    const invoice = new InvoiceBusDto(invoiceParsed);

    const commissionResult = ticket['Komisyon'][0];
    const commissionParsed: CommissionBus = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(commissionResult)) {
      commissionParsed[key] = value;
    }
    const commission = new CommissionBusDto(commissionParsed);

    const seatNumbersResult = ticket['KoltukNolar'][0];
    const seatNumbersParsed: SeatNumbersBus = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(seatNumbersResult)) {
      seatNumbersParsed[key] = value;
    }
    const seatNumbers = new SeatNumbersBusDto(seatNumbersParsed);

    const agencyPrepaymentResult = ticket['AcenteOnOdeme'][0];
    const agencyPrepaymentParsed: AgencyPrepaymentBus = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(agencyPrepaymentResult)) {
      agencyPrepaymentParsed[key] = value;
    }
    const agencyPrepayment = new AgencyPrepaymentBusDto(agencyPrepaymentParsed);

    const pnrExtraServiceSegmentResult = ticket['PnrEkHizmetSegment'][0];
    const pnrExtraServiceSegmentParsed: PnrExtraServiceSegmentBus =
      Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(
      pnrExtraServiceSegmentResult,
    )) {
      if (key === 'KalkisKod') {
        pnrExtraServiceSegmentParsed.KalkisKod = { KalkisKod: value };
      } else if (key === 'VarisKod') {
        pnrExtraServiceSegmentParsed.VarisKod = { VarisKod: value };
      } else {
        pnrExtraServiceSegmentParsed[key] = value;
      }
    }
    const pnrExtraServiceSegment = new PnrExtraServiceSegmentBusDto(
      pnrExtraServiceSegmentParsed,
    );

    return new PnrSearchBusDto(
      pnr,
      passenger,
      segment,
      openTicket,
      membership,
      collection,
      pnrTransactionDetail,
      invoice,
      commission,
      seatNumbers,
      agencyPrepayment,
      pnrExtraServiceSegment,
    );
  };

  private parsePnrSearchDomesticFlightResponse = (
    extractedResult: PnrSearchDomesticFlightDataSet,
  ): PnrSearchDomesticFlightDto => {
    const ticket = extractedResult['Bilet'][0];

    const pnrResult = ticket['PNR'][0];

    const pnrParsed: PnrDomesticFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(pnrResult)) {
      pnrParsed[key] = value;
    }
    const pnr = new PnrDomesticFlightDto(pnrParsed);

    const passengerResult = ticket['Yolcu'][0];
    const passengerParsed: PassengerDomesticFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(passengerResult)) {
      passengerParsed[key] = value;
    }
    const passenger = new PassengerDomesticFlightDto(passengerParsed);

    const segmentResult = ticket['Segment'][0];
    const segmentParsed: SegmentDomesticFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(segmentResult)) {
      segmentParsed[key] = value;
    }
    const segment = new SegmentDomesticFlightDto(segmentParsed);

    const openTicketResult = ticket['AcikBilet'][0];
    const openTicketParsed: OpenTicketDomesticFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(openTicketResult)) {
      openTicketParsed[key] = value;
    }
    const openTicket = new OpenTicketDomesticFlightDto(openTicketParsed);

    const membershipResult = ticket['Uyelik'][0];

    const membershipParsed: MembershipDomesticFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(membershipResult)) {
      membershipParsed[key] = value;
    }
    const membership = new MembershipDomesticFlightDto(membershipParsed);

    const collectionResult = ticket['Tahsilat'][0];
    const collectionParsed: CollectionDomesticFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(collectionResult)) {
      collectionParsed[key] = value;
    }
    const collection = new CollectionDomesticFlightDto(collectionParsed);

    const PnrTransactionDetailResult = ticket['PNRIslemDetay'][0];
    const pnrTransactionDetailParsed: PnrTransactionDetailDomesticFlight =
      Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(
      PnrTransactionDetailResult,
    )) {
      pnrTransactionDetailParsed[key] = value;
    }
    const pnrTransactionDetail = new PnrTransactionDetailDomesticFlightDto(
      pnrTransactionDetailParsed,
    );

    const invoiceResult = ticket['Fatura'][0];
    const invoiceParsed: InvoiceDomesticFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(invoiceResult)) {
      invoiceParsed[key] = value;
    }
    const invoice = new InvoiceDomesticFlightDto(invoiceParsed);

    const commissionResult = ticket['Komisyon'][0];
    const commissionParsed: CommissionDomesticFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(commissionResult)) {
      commissionParsed[key] = value;
    }
    const commission = new CommissionDomesticFlightDto(commissionParsed);

    const seatNumbersResult = ticket['KoltukNolar'][0];
    const seatNumbersParsed: SeatNumbersDomesticFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(seatNumbersResult)) {
      seatNumbersParsed[key] = value;
    }
    const seatNumbers = new SeatNumbersDomesticFlightDto(seatNumbersParsed);

    const agencyPrepaymentResult = ticket['AcenteOnOdeme'][0];
    const agencyPrepaymentParsed: AgencyPrepaymentDomesticFlight =
      Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(agencyPrepaymentResult)) {
      agencyPrepaymentParsed[key] = value;
    }
    const agencyPrepayment = new AgencyPrepaymentDomesticFlightDto(
      agencyPrepaymentParsed,
    );

    const pnrExtraServiceSegmentResult = ticket['PnrEkHizmetSegment'][0];
    const pnrExtraServiceSegmentParsed: PnrExtraServiceSegmentDomesticFlight =
      Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(
      pnrExtraServiceSegmentResult,
    )) {
      if (key === 'UcuslarinHavayolundakiSonDurumu') {
        pnrExtraServiceSegmentParsed.UcuslarinHavayolundakiSonDurumu = {
          UcuslardaIptalveyaDegisiklikVarMi: value,
        };
      } else {
        pnrExtraServiceSegmentParsed[key] = value;
      }
    }
    const pnrExtraServiceSegment = new PnrExtraServiceSegmentDomesticFlightDto(
      pnrExtraServiceSegmentParsed,
    );

    return new PnrSearchDomesticFlightDto(
      pnr,
      passenger,
      segment,
      openTicket,
      membership,
      collection,
      pnrTransactionDetail,
      invoice,
      commission,
      seatNumbers,
      agencyPrepayment,
      pnrExtraServiceSegment,
    );
  };

  private parsePnrSearchAbroadFlightResponse = (
    extractedResult: PnrSearchAbroadFlightDataSet,
  ): PnrSearchAbroadFlightDto => {
    const ticket = extractedResult['Bilet'][0];

    const pnrResult = ticket['PNR'][0];
    const pnrParsed: PnrAbroadFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(pnrResult)) {
      pnrParsed[key] = value;
    }

    const pnr = new PnrAbroadFlightDto(pnrParsed);

    const passengerResult = ticket['Yolcu'][0];

    const passengerParsed: PassengerAbroadFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(passengerResult)) {
      passengerParsed[key] = value;
    }
    const passenger = new PassengerAbroadFlightDto(passengerParsed);

    const segmentResult = ticket['Segment'][0];
    const segmentParsed: SegmentAbroadFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(segmentResult)) {
      segmentParsed[key] = value;
    }
    const segment = new SegmentAbroadFlightDto(segmentParsed);

    const openTicketResult = ticket['AcikBilet'][0];
    const openTicketParsed: OpenTicketAbroadFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(openTicketResult)) {
      openTicketParsed[key] = value;
    }
    const openTicket = new OpenTicketAbroadFlightDto(openTicketParsed);

    const membershipResult = ticket['Uyelik'][0];
    const membershipParsed: MembershipAbroadFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(membershipResult)) {
      membershipParsed[key] = value;
    }
    const membership = new MembershipAbroadFlightDto(membershipParsed);

    const invoiceResult = ticket['Fatura'][0];
    const invoiceParsed: InvoiceAbroadFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(invoiceResult)) {
      invoiceParsed[key] = value;
    }
    const invoice = new InvoiceAbroadFlightDto(invoiceParsed);

    const seatNumbersResult = ticket['KoltukNolar'][0];
    const seatNumbersParsed: SeatNumbersAbroadFlight = Object.assign({});
    for (const [key, [value]] of ObjectTyped.entries(seatNumbersResult)) {
      seatNumbersParsed[key] = value;
    }
    const seatNumbers = new SeatNumbersAbroadFlightDto(seatNumbersParsed);

    const pnrExtraServiceSegmentResult = ticket['PnrEkHizmetSegment'][0];
    const pnrExtraServiceSegmentParsed: PnrExtraServiceSegmentAbroadFlight =
      Object.assign({});
    for (const [key, [value]] of Object.entries(pnrExtraServiceSegmentResult)) {
      pnrExtraServiceSegmentParsed[key] = value;
    }
    const pnrExtraServiceSegment = new PnrExtraServiceSegmentAbroadFlightDto(
      pnrExtraServiceSegmentParsed,
    );

    const paymentRulesResult = ticket['OdemeKurallari'][0];
    const paymentRulesParsed: PaymentRulesAbroadFlight = Object.assign({});
    for (const [key, [value]] of Object.entries(paymentRulesResult)) {
      paymentRulesParsed[key] = value;
    }
    const paymentRules = new PaymentRulesAbroadFlightDto(paymentRulesParsed);

    return new PnrSearchAbroadFlightDto(
      pnr,
      passenger,
      segment,
      openTicket,
      membership,
      invoice,
      seatNumbers,
      pnrExtraServiceSegment,
      paymentRules,
    );
  };

  public parsePnrSearchResponse = (
    response: PnrSearchResponse,
  ):
    | PnrSearchBusDto
    | PnrSearchDomesticFlightDto
    | PnrSearchAbroadFlightDto => {
    const extractedResult: any = this.extractResult(response);
    const ticket = extractedResult['Bilet'][0];
    const pnr = ticket['PNR'][0];
    const pnrTip = pnr['PnrTip'][0];

    if (pnrTip === 'K' || pnrTip === 'M') {
      return this.parsePnrSearchBusResponse(extractedResult);
    } else if (pnrTip === 'T' || pnrTip === 'H' || pnrTip === 'S') {
      return this.parsePnrSearchDomesticFlightResponse(extractedResult);
    } else if (pnrTip === 'G') {
      return this.parsePnrSearchAbroadFlightResponse(extractedResult);
    } else {
      throw new Error(`Invalid PnrTip received: ${pnrTip}`);
    }
  };
}
