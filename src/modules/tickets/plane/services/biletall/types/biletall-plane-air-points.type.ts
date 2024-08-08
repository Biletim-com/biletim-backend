import { SoapEnvelope } from '@app/modules/tickets/bus/services/biletall/types/biletall-soap-envelope.type';

export type PlaneAirPoint = {
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

type PlaneAirPointDataSet = {
  HavaNoktalar: Array<{
    HavaNokta: Array<{
      [K in keyof PlaneAirPoint]: [string];
    }>;
  }>;
};

export type PlaneAirPointResponse = SoapEnvelope<PlaneAirPointDataSet>;
