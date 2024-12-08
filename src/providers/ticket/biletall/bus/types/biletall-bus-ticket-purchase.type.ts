import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type BusTicketPurchaseRequest = {
  Sonuc: string; // true || false
  PNR: string;
  Mesaj: string;
  SeferInternetTarihSaat: string;
  Hata: string;
  Ebilet1: string;
};

type BusTicketSaleRequestDataSet = {
  IslemSonuc: Array<{
    [K in keyof BusTicketPurchaseRequest]: [string];
  }>;
};

export type BusTicketPurchaseRequestResponse =
  SoapEnvelope<BusTicketSaleRequestDataSet>;
