import { SoapEnvelope } from '@app/modules/tickets/bus/services/biletall/types/biletall-soap-envelope.type';

export type FlightTicketReservationResult = {
  Sonuc: string[];
  PNR: string[];
  RezervasyonOpsiyon: string[];
};

type PlaneTicketReservationDataSet = {
  IslemSonuc: {
    [K in keyof FlightTicketReservationResult]: [string];
  };
};

export type PlaneTicketReservationResponse =
  SoapEnvelope<PlaneTicketReservationDataSet>;
