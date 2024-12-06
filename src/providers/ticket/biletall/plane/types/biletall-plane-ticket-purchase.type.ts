import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type FlightTicketPurchaseResult = {
  Sonuc: string;
  PNR: string;
  Mesaj: string;
  Hata: string;
  [key: `EBilet${number}`]: string;
};

type PlaneTicketPurchaseDataSet = {
  IslemSonuc: {
    [K in keyof FlightTicketPurchaseResult]: string[];
  };
};

export type PlaneTicketPurchaseResponse =
  SoapEnvelope<PlaneTicketPurchaseDataSet>;
