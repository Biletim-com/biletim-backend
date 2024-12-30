import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

// services
import { TicketConfigService } from '@app/configs/ticket';
import { BiletAllPlaneTicketPurchaseParserService } from '../parsers/biletall-plane-ticket-purchase.parser.service';
import { BiletAllRequestService } from '../../services/biletall-request.service';

// entites
import { PlaneTicketOrder } from '@app/modules/orders/plane-ticket/entities/plane-ticket-order.entity';
import { PlaneTicket } from '@app/modules/orders/plane-ticket/entities/plane-ticket.entity';
import { PlaneTicketSegment } from '@app/modules/orders/plane-ticket/entities/plane-ticket-segment.entity';

// dto
import { FlightTicketPurchaseDto } from '../dto/plane-ticket-purchase.dto';
import { FlightTicketReservationDto } from '../dto/plane-ticket-reservation.dto';

// enums
import { PlaneTicketOperationType } from '@app/common/enums';

// types
import { PlaneTicketPurchaseResponse } from '../types/biletall-plane-ticket-purchase.type';
import { PlaneTicketReservationResponse } from '../types/biletall-plane-ticket-reservation.type';

// helpers
import { BiletAllPlanePassengerType } from '../helpers/plane-passanger-type.helper';
import { BiletAllPlaneTicketOperationType } from '../helpers/plane-ticket-operation-type.helper';
import { BiletAllGender } from '../../helpers/biletall-gender.helper';

// utils
import { turkishToEnglish } from '@app/common/utils';

@Injectable()
export class BiletAllPlaneTicketPurchaseService {
  private readonly biletAllRequestService: BiletAllRequestService;
  constructor(
    ticketConfigService: TicketConfigService,
    private readonly biletAllPlaneTicketPurchaseParserService: BiletAllPlaneTicketPurchaseParserService,
  ) {
    this.biletAllRequestService = new BiletAllRequestService(
      ticketConfigService.biletAllBaseUrl,
      ticketConfigService.biletAllUsername,
      ticketConfigService.biletAllPassword,
    );
  }

  async processPlaneTicket(
    clientIp: string,
    operationType: PlaneTicketOperationType.PURCHASE,
    totalPrice: string,
    order: PlaneTicketOrder,
    planeTickets: PlaneTicket[],
    segments: PlaneTicketSegment[],
  ): Promise<FlightTicketPurchaseDto>;

  async processPlaneTicket(
    clientIp: string,
    operationType: PlaneTicketOperationType.RESERVATION,
    totalPrice: string,
    order: PlaneTicketOrder,
    planeTickets: PlaneTicket[],
    segments: PlaneTicketSegment[],
  ): Promise<FlightTicketReservationDto>;

  async processPlaneTicket(
    clientIp: string,
    operationType: PlaneTicketOperationType,
    totalPrice: string,
    order: PlaneTicketOrder,
    planeTickets: PlaneTicket[],
    segments: PlaneTicketSegment[],
  ): Promise<FlightTicketPurchaseDto | FlightTicketReservationDto> {
    const builder = new xml2js.Builder({ headless: true });
    const requestDocument = {
      IslemUcak_2: {
        IslemTip: BiletAllPlaneTicketOperationType[operationType],
        FirmaNo: segments[0].companyNumber,
        TelefonNo: order.userPhoneNumber,
        CepTelefonNo: order.userPhoneNumber,
        Email: order.userEmail,
        HatirlaticiNot: '',
        ...segments.reduce((acc, segment, index) => {
          acc[`Segment${index + 1}`] = {
            Kalkis: segment.departureAirport.airportCode,
            Varis: segment.arrivalAirport.airportCode,
            KalkisTarih: segment.departureDateTime,
            VarisTarih: segment.arrivalDateTime,
            UcusNo: segment.flightNumber,
            FirmaKod: segment.airlineCode,
            Sinif: segment.flightClassCode,
            DonusMu: segment.isReturnFlight ? 1 : 0,
            ...(segment.flightCode && { SeferKod: segment.flightCode }),
          };
          return acc;
        }, {}),
        ...planeTickets.reduce((acc, planeTicket, index) => {
          const { passenger } = planeTicket;
          acc[`Yolcu${index + 1}`] = {
            Ad: turkishToEnglish(passenger.firstName),
            Soyad: turkishToEnglish(passenger.lastName),
            Cinsiyet: BiletAllGender[passenger.gender],
            YolcuTip: BiletAllPlanePassengerType[passenger.passengerType],
            TCKimlikNo: passenger.tcNumber,
            DogumTarih: passenger.birthday,
            ...(passenger.passportNumber && {
              PasaportNo: passenger.passportNumber,
            }),
            ...(passenger.passportCountryCode && {
              PasaportUlkeKod: passenger.passportCountryCode,
            }),
            ...(passenger.passportExpirationDate && {
              PasaportGecerlilikTarihi: passenger.passportExpirationDate,
            }),
            NetFiyat: planeTicket.netPrice,
            Vergi: planeTicket.taxAmount,
            ServisUcret: planeTicket.serviceFee,
          };
          return acc;
        }, {}),
        ...(operationType === PlaneTicketOperationType.PURCHASE && {
          WebYolcu: {
            Ip: clientIp,
            OnOdemeKullan: 1,
            OnOdemeTutar: totalPrice,
          },
        }),
      },
    };

    const xml = builder.buildObject(requestDocument);
    const res = await this.biletAllRequestService.run<
      PlaneTicketPurchaseResponse | PlaneTicketReservationResponse
    >(xml);

    return operationType === PlaneTicketOperationType.PURCHASE
      ? this.biletAllPlaneTicketPurchaseParserService.parseFlightTicketPurchase(
          res,
        )
      : this.biletAllPlaneTicketPurchaseParserService.parseFlightTicketReservation(
          res,
        );
  }
}
