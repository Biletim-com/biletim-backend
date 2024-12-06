import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type BusServiceInformation = {
  Yer: string;
  Saat: string;
  Internette_Gozuksunmu: string;
};

type BusServiceInformationDataSet = {
  NewDataSet: Array<{
    Table: Array<{
      [K in keyof BusServiceInformation]: [string];
    }>;
  }>;
};

export type BusServiceInformationResponse =
  SoapEnvelope<BusServiceInformationDataSet>;
