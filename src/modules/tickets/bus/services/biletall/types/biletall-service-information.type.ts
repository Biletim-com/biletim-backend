import { SoapEnvelope } from '@app/common/types';

export type ServiceInformation = {
  Yer: string;
  Saat: string;
  Internette_Gozuksunmu: string;
};

type ServiceInformationDataSet = {
  NewDataSet: Array<{
    Table: Array<{
      [K in keyof ServiceInformation]: [string];
    }>;
  }>;
};

export type ServiceInformationResponse =
  SoapEnvelope<ServiceInformationDataSet>;
