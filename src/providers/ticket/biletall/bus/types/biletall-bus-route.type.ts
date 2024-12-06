import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type BusRouteDetail = {
  VarisYeri: string;
  SiraNo: string;
  KalkisTarihSaat: string;
  VarisTarihSaat: string;
  KaraNoktaID: string;
  KaraNoktaAd: string;
};

type BusRouteDetailDataSet = {
  NewDataSet: Array<{
    Table1: Array<{
      [K in keyof BusRouteDetail]: [string];
    }>;
  }>;
};

export type BusRouteDetailResponse = SoapEnvelope<BusRouteDetailDataSet>;
