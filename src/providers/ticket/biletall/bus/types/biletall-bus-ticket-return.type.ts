import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type BusTicketReturn = {
  Sonuc: string;
  Tutar: string;
};

type BusTicketReturnDataSet = {
  IslemSonuc: Array<{
    [K in keyof BusTicketReturn]: [string];
  }>;
};

export type BusTicketReturnResponse = SoapEnvelope<BusTicketReturnDataSet>;
