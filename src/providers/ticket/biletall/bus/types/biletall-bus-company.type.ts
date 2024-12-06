import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type BusCompany = {
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

type BusCompaniesDataSet = {
  NewDataSet: Array<{
    Table: Array<{
      [K in keyof BusCompany]: [string];
    }>;
  }>;
};

export type BusCompaniesResponse = SoapEnvelope<BusCompaniesDataSet>;
