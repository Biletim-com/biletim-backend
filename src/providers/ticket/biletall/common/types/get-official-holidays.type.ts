import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type Day = {
  Gun: string;
  Aciklama: string;
  AciklamaEN: string;
  AciklamaDE: string;
  AciklamaRU: string;
  ResmiMi: string;
  GrupAd: string;
};

export type OfficialHolidaysDataSet = {
  ResmiTatilGunleri: Array<{
    Gunler: Array<Day>;
  }>;
};

export type OfficialHolidaysResponse = SoapEnvelope<OfficialHolidaysDataSet>;
