import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type BusTicketPurchaseResult = {
  Sonuc: string; // true || false
  PNR: string;
  Mesaj: string;
  SeferInternetTarihSaat: string;
  Hata: string;
  Ebilet1: string;
};

type BusTicketSaleRequestDataSet = {
  IslemSonuc: Array<{
    [K in keyof BusTicketPurchaseResult]: [string];
  }>;
};

export type BusTicketPurchaseResultResponse =
  SoapEnvelope<BusTicketSaleRequestDataSet>;
