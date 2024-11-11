import { SoapEnvelope } from '@app/common/types';

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
