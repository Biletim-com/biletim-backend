import { SoapEnvelope } from './biletall-soap-envelope.type';

export type BiletAllStopPoint = {
  ID: string;
  SeyahatSehirID: string;
  UlkeKodu: string;
  Bolge: string;
  Ad: string;
  Aciklama: string;
  MerkezMi: string;
  BagliOlduguNoktaID: string;
  AramadaGorunsun: string;
};

type BiletAllStopPointDataSet = {
  KaraNoktalar: Array<{
    KaraNokta: Array<{
      [K in keyof BiletAllStopPoint]: [string];
    }>;
  }>;
};

export type BiletAllStopPointResponse = SoapEnvelope<BiletAllStopPointDataSet>;
