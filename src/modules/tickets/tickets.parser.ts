import { Injectable } from '@nestjs/common';
import { BiletAllParser } from './bus/services/biletall/biletall.parser';
import { PnrSearchResponse } from './type/tickets-pnr-search-union.type';
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
} from './type/tickets-pnr-search-abroad-flight-response.type';
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
} from './type/tickets-pnr-search-domestic-flight-response.type';
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
} from './dto/tickets-pnr-search-abroad-flight.dto';
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
} from './dto/tickets-pnr-search-domestic-flight.dto';
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
} from './type/tickets-pnr-search-bus-response.type';
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
} from './dto/tickets-pnr-search-bus.dto';

@Injectable()
export class TicketsParser {
  constructor(private readonly biletAllParser: BiletAllParser) {}

  private parsePnrSearchBusResponse = (
    extractedResult: PnrSearchBusDataSet,
  ): PnrSearchBusDto => {
    const ticket = extractedResult['Bilet'][0];

    const pnrResult = ticket['PNR'];
    const pnr = pnrResult.map((entry) => {
      const pnrParsed: PnrBus = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        pnrParsed[key] = value;
      }
      return new PnrBusDto(pnrParsed);
    });

    const passengerResult = ticket['Yolcu'];
    const passenger = passengerResult.map((entry) => {
      const passengerParsed: PassengerBus = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        passengerParsed[key] = value;
      }
      return new PassengerBusDto(passengerParsed);
    });

    const segmentResult = ticket['Segment'];
    const segment = segmentResult.map((entry) => {
      const segmentParsed: SegmentBus = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        segmentParsed[key] = value;
      }
      return new SegmentBusDto(segmentParsed);
    });

    const openTicketResult = ticket['AcikBilet'];
    const openTicket = openTicketResult.map((entry) => {
      const openTicketParsed: OpenTicketBus = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        openTicketParsed[key] = value;
      }
      return new OpenTicketBusDto(openTicketParsed);
    });

    const membershipResult = ticket['Uyelik'];
    const membership = membershipResult.map((entry) => {
      const membershipParsed: MembershipBus = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        membershipParsed[key] = value;
      }
      return new MembershipBusDto(membershipParsed);
    });

    const collectionResult = ticket['Tahsilat'];
    const collection = collectionResult.map((entry) => {
      const collectionParsed: CollectionBus = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        collectionParsed[key] = value;
      }
      return new CollectionBusDto(collectionParsed);
    });

    const PnrTransactionDetailResult = ticket['PNRIslemDetay'];
    const pnrTransactionDetail = PnrTransactionDetailResult.map((entry) => {
      const pnrTransactionDetailParsed: PnrTransactionDetailBus = Object.assign(
        {},
      );
      for (const [key, value] of Object.entries(entry)) {
        pnrTransactionDetailParsed[key] = value;
      }
      return new PnrTransactionDetailBusDto(pnrTransactionDetailParsed);
    });

    const invoiceResult = ticket['Fatura'];
    const invoice = invoiceResult.map((entry) => {
      const invoiceParsed: InvoiceBus = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        invoiceParsed[key] = value;
      }
      return new InvoiceBusDto(invoiceParsed);
    });

    const commissionResult = ticket['Komisyon'];
    const commission = commissionResult.map((entry) => {
      const commissionParsed: CommissionBus = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        commissionParsed[key] = value;
      }
      return new CommissionBusDto(commissionParsed);
    });

    const seatNumbersResult = ticket['KoltukNolar'];
    const seatNumbers = seatNumbersResult.map((entry) => {
      const seatNumbersParsed: SeatNumbersBus = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        seatNumbersParsed[key] = value;
      }
      return new SeatNumbersBusDto(seatNumbersParsed);
    });

    const agencyPrepaymentResult = ticket['AcenteOnOdeme'];
    const agencyPrepayment = agencyPrepaymentResult.map((entry) => {
      const agencyPrepaymentParsed: AgencyPrepaymentBus = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        agencyPrepaymentParsed[key] = value;
      }
      return new AgencyPrepaymentBusDto(agencyPrepaymentParsed);
    });

    const pnrExtraServiceSegmentResult = ticket['PnrEkHizmetSegment'];
    const pnrExtraServiceSegment = pnrExtraServiceSegmentResult.map((entry) => {
      const pnrExtraServiceSegmentParsed: PnrExtraServiceSegmentBus =
        Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        pnrExtraServiceSegmentParsed[key] = value;
      }
      return new PnrExtraServiceSegmentBusDto(pnrExtraServiceSegmentParsed);
    });

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

    const pnrResult = ticket['PNR'];
    const pnr = pnrResult.map((entry) => {
      const pnrParsed: PnrDomesticFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        pnrParsed[key] = value;
      }
      return new PnrDomesticFlightDto(pnrParsed);
    });

    const passengerResult = ticket['Yolcu'];
    const passenger = passengerResult.map((entry) => {
      const passengerParsed: PassengerDomesticFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        passengerParsed[key] = value;
      }
      return new PassengerDomesticFlightDto(passengerParsed);
    });

    const segmentResult = ticket['Segment'];
    const segment = segmentResult.map((entry) => {
      const segmentParsed: SegmentDomesticFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        segmentParsed[key] = value;
      }
      return new SegmentDomesticFlightDto(segmentParsed);
    });

    const openTicketResult = ticket['AcikBilet'];
    const openTicket = openTicketResult.map((entry) => {
      const openTicketParsed: OpenTicketDomesticFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        openTicketParsed[key] = value;
      }
      return new OpenTicketDomesticFlightDto(openTicketParsed);
    });

    const membershipResult = ticket['Uyelik'];
    const membership = membershipResult.map((entry) => {
      const membershipParsed: MembershipDomesticFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        membershipParsed[key] = value;
      }
      return new MembershipDomesticFlightDto(membershipParsed);
    });

    const collectionResult = ticket['Tahsilat'];
    const collection = collectionResult.map((entry) => {
      const collectionParsed: CollectionDomesticFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        collectionParsed[key] = value;
      }
      return new CollectionDomesticFlightDto(collectionParsed);
    });

    const PnrTransactionDetailResult = ticket['PNRIslemDetay'];
    const pnrTransactionDetail = PnrTransactionDetailResult.map((entry) => {
      const pnrTransactionDetailParsed: PnrTransactionDetailDomesticFlight =
        Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        pnrTransactionDetailParsed[key] = value;
      }
      return new PnrTransactionDetailDomesticFlightDto(
        pnrTransactionDetailParsed,
      );
    });

    const invoiceResult = ticket['Fatura'];
    const invoice = invoiceResult.map((entry) => {
      const invoiceParsed: InvoiceDomesticFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        invoiceParsed[key] = value;
      }
      return new InvoiceDomesticFlightDto(invoiceParsed);
    });

    const commissionResult = ticket['Komisyon'];
    const commission = commissionResult.map((entry) => {
      const commissionParsed: CommissionDomesticFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        commissionParsed[key] = value;
      }
      return new CommissionDomesticFlightDto(commissionParsed);
    });

    const seatNumbersResult = ticket['KoltukNolar'];
    const seatNumbers = seatNumbersResult.map((entry) => {
      const seatNumbersParsed: SeatNumbersDomesticFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        seatNumbersParsed[key] = value;
      }
      return new SeatNumbersDomesticFlightDto(seatNumbersParsed);
    });

    const agencyPrepaymentResult = ticket['AcenteOnOdeme'];
    const agencyPrepayment = agencyPrepaymentResult.map((entry) => {
      const agencyPrepaymentParsed: AgencyPrepaymentDomesticFlight =
        Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        agencyPrepaymentParsed[key] = value;
      }
      return new AgencyPrepaymentDomesticFlightDto(agencyPrepaymentParsed);
    });

    const pnrExtraServiceSegmentResult = ticket['PnrEkHizmetSegment'];
    const pnrExtraServiceSegment = pnrExtraServiceSegmentResult.map((entry) => {
      const pnrExtraServiceSegmentParsed: PnrExtraServiceSegmentDomesticFlight =
        Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        pnrExtraServiceSegmentParsed[key] = value;
      }
      return new PnrExtraServiceSegmentDomesticFlightDto(
        pnrExtraServiceSegmentParsed,
      );
    });

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

    const pnrResult = ticket['PNR'];
    const pnr = pnrResult.map((entry) => {
      const pnrParsed: PnrAbroadFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        pnrParsed[key] = value;
      }
      return new PnrAbroadFlightDto(pnrParsed);
    });

    const passengerResult = ticket['Yolcu'];
    const passenger = passengerResult.map((entry) => {
      const passengerParsed: PassengerAbroadFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        passengerParsed[key] = value;
      }
      return new PassengerAbroadFlightDto(passengerParsed);
    });

    const segmentResult = ticket['Segment'];
    const segment = segmentResult.map((entry) => {
      const segmentParsed: SegmentAbroadFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        segmentParsed[key] = value;
      }
      return new SegmentAbroadFlightDto(segmentParsed);
    });

    const openTicketResult = ticket['AcikBilet'];
    const openTicket = openTicketResult.map((entry) => {
      const openTicketParsed: OpenTicketAbroadFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        openTicketParsed[key] = value;
      }
      return new OpenTicketAbroadFlightDto(openTicketParsed);
    });

    const membershipResult = ticket['Uyelik'];
    const membership = membershipResult.map((entry) => {
      const membershipParsed: MembershipAbroadFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        membershipParsed[key] = value;
      }
      return new MembershipAbroadFlightDto(membershipParsed);
    });

    const invoiceResult = ticket['Fatura'];
    const invoice = invoiceResult.map((entry) => {
      const invoiceParsed: InvoiceAbroadFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        invoiceParsed[key] = value;
      }
      return new InvoiceAbroadFlightDto(invoiceParsed);
    });

    const seatNumbersResult = ticket['KoltukNolar'];
    const seatNumbers = seatNumbersResult.map((entry) => {
      const seatNumbersParsed: SeatNumbersAbroadFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        seatNumbersParsed[key] = value;
      }
      return new SeatNumbersAbroadFlightDto(seatNumbersParsed);
    });

    const pnrExtraServiceSegmentResult = ticket['PnrEkHizmetSegment'];
    const pnrExtraServiceSegment = pnrExtraServiceSegmentResult.map((entry) => {
      const pnrExtraServiceSegmentParsed: PnrExtraServiceSegmentAbroadFlight =
        Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        pnrExtraServiceSegmentParsed[key] = value;
      }
      return new PnrExtraServiceSegmentAbroadFlightDto(
        pnrExtraServiceSegmentParsed,
      );
    });

    const paymentRulesResult = ticket['OdemeKurallari'];
    const paymentRules = paymentRulesResult.map((entry) => {
      const paymentRulesParsed: PaymentRulesAbroadFlight = Object.assign({});
      for (const [key, value] of Object.entries(entry)) {
        paymentRulesParsed[key] = value;
      }
      return new PaymentRulesAbroadFlightDto(paymentRulesParsed);
    });

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
    const extractedResult: any = this.biletAllParser.extractResult(response);
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
