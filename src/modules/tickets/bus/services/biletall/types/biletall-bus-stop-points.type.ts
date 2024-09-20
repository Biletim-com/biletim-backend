import { SoapEnvelope } from './biletall-soap-envelope.type';

export type BusTerminal = {
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

type BusStopPointDataSet = {
  KaraNoktalar: Array<{
    KaraNokta: Array<{
      [K in keyof BusTerminal]: [string];
    }>;
  }>;
};

export type BusStopPointResponse = SoapEnvelope<BusStopPointDataSet>;
