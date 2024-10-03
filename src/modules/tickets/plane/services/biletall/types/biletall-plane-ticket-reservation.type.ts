import { SoapEnvelope } from '@app/common/types';

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
