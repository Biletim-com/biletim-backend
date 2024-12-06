import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type FlightTicketReservationResult = {
  Sonuc: string;
  PNR: string;
  Mesaj?: string;
  Hata?: string;
  RezervasyonOpsiyon: string;
};

type PlaneTicketReservationDataSet = {
  IslemSonuc: {
    [K in keyof FlightTicketReservationResult]: string[];
  };
};

export type PlaneTicketReservationResponse =
  SoapEnvelope<PlaneTicketReservationDataSet>;
