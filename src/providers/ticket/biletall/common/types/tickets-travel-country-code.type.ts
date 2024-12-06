import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

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
