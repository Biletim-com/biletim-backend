import { SoapEnvelope } from '@app/modules/tickets/bus/services/biletall/types/biletall-soap-envelope.type';

export type FlightTicketPurchaseResult = {
  Sonuc: string[];
  PNR: string[];
  EBilet?: { [key: string]: string[] };
};

type PlaneTicketPurchaseDataSet = {
  IslemSonuc: {
    [K in keyof FlightTicketPurchaseResult]: [string];
  };
};

export type PlaneTicketPurchaseResponse =
  SoapEnvelope<PlaneTicketPurchaseDataSet>;
