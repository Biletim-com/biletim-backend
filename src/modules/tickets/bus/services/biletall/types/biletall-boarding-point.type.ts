import { SoapEnvelope } from './biletall-soap-envelope.type';

export type BoardingPoint = {
  Yer?: string[];
  Saat: string[];
  Internette_Gozuksunmu?: string[];
};

interface BoardingPointDataSet {
  NewDataSet: Array<{
    Table: Array<{
      [K in keyof BoardingPoint]: [string];
    }>;
  }>;
}

export type BoardingPointResponse = SoapEnvelope<BoardingPointDataSet>;
