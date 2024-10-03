import { SoapEnvelope } from '@app/common/types';

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
