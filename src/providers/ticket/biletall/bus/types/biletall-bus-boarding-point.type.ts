import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type BusBoardingPoint = {
  Yer?: string;
  Saat: string;
  Internette_Gozuksunmu?: '0' | '1';
};

type BusBoardingPointDataSet = {
  NewDataSet: Array<{
    Table: Array<{
      [K in keyof BusBoardingPoint]: [string];
    }>;
  }>;
};

export type BusBoardingPointResponse = SoapEnvelope<BusBoardingPointDataSet>;
