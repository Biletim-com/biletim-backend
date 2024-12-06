import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type BusTicketSaleRequest = {
  Sonuc: string; // true || false
  PNR: string;
  Mesaj: string;
  SeferInternetTarihSaat: string;
  Hata: string;
  Ebilet1: string;
};

type BusTicketSaleRequestDataSet = {
  IslemSonuc: Array<{
    [K in keyof BusTicketSaleRequest]: [string];
  }>;
};

export type BusTicketSaleRequestResponse =
  SoapEnvelope<BusTicketSaleRequestDataSet>;
