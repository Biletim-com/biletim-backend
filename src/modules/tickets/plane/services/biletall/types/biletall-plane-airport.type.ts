import { SoapEnvelope } from '@app/common/types';

export type PlaneAirport = {
  UlkeKod: string;
  UlkeAd: string;
  UlkeAdEn: string;
  SehirKod: string;
  SehirAd: string;
  SehirAdEn: string;
  HavaAlanKod: string;
  HavaAlanAd: string;
  HavaAlanAdEn: string;
  HavaAlanBolge: string;
  HavaAlanBolgeEn: string;
};

type PlaneAirportDataSet = {
  HavaNoktalar: Array<{
    HavaNokta: Array<{
      [K in keyof PlaneAirport]: [string];
    }>;
  }>;
};

export type PlaneAirportResponse = SoapEnvelope<PlaneAirportDataSet>;
