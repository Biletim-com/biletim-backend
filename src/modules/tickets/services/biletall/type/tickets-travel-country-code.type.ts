import { SoapEnvelope } from '@app/common/types';

export type Country = {
  ID: string;
  Kod: string;
  Ad: string;
  AdEn: string;
  OtobusSeyahatUyari: string;
  OtobusSeyahatUyariEn: string;
  AramaAnahtarlari: string;
};

export type TravelCountryCodeDataSet = {
  SeyahatUlkeler: Array<{
    Ulke: Array<Country>;
  }>;
};

export type TravelCountryCodeResponse = SoapEnvelope<TravelCountryCodeDataSet>;
