import { SoapEnvelope } from './biletall-soap-envelope.type';

export type BoardingPoint = {
  Yer?: string;
  Saat: string;
  Internette_Gozuksunmu?: '0' | '1';
};

type BoardingPointDataSet = {
  NewDataSet: Array<{
    Table: Array<{
      [K in keyof BoardingPoint]: [string];
    }>;
  }>;
};

export type BoardingPointResponse = SoapEnvelope<BoardingPointDataSet>;
