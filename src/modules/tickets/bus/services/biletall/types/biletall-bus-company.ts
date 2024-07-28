import { SoapEnvelope } from './biletall-bus-soap-envelope.type';

export type BiletAllCompany = {
  Firma_No: string;
  Firmaadi: string;
  FirmaLogo: string;
  BosSubeKodu: string;
  BosKullaniciKodu: string;
  Bilet_Seri_No_Takip: string;
  Bilet_Seri_No: string;
  WebAdresi: string;
  Telefon: string;
  Sat_Koltuk_Adet: string;
  Rez_Koltuk_Adet: string;
  FirmaNoStr: string;
  FirmaOtobusteMaxAyniUyeKartliIslemSayisi: string;
  FirmaCokluCinsiyetIslemYapabilir: string;
  SefereKadarIptalEdilebilmeSuresiDakika: string;
  BiletIptalAktifMi: string;
  AcikParaKullanimAktifMi: string;
};

type BiletAllCompanyDataSet = {
  NewDataSet: Array<{
    Table: Array<{
      [K in keyof BiletAllCompany]: [string];
    }>;
  }>;
};

export type BiletAllCompanyResponse = SoapEnvelope<BiletAllCompanyDataSet>;
