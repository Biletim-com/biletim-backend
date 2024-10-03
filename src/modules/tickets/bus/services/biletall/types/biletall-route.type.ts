import { SoapEnvelope } from '@app/common/types';

export type RouteDetail = {
  VarisYeri: string;
  SiraNo: string;
  KalkisTarihSaat: string;
  VarisTarihSaat: string;
  KaraNoktaID: string;
  KaraNoktaAd: string;
};

type RouteDetailDataSet = {
  NewDataSet: Array<{
    Table1: Array<{
      [K in keyof RouteDetail]: [string];
    }>;
  }>;
};

export type RouteDetailResponse = SoapEnvelope<RouteDetailDataSet>;
