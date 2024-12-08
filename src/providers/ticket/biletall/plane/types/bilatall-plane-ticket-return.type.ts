import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type PlaneTicketReturn = {
  Sonuc: string;
  Tutar: string;
};

type PlaneTicketReturnDataSet = {
  IslemSonuc: Array<{
    [K in keyof PlaneTicketReturn]: [string];
  }>;
};

export type PlaneTicketReturnResponse = SoapEnvelope<PlaneTicketReturnDataSet>;
