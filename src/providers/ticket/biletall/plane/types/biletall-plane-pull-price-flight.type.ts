import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type PlanePrices = {
  ToplamYolcuSayisi: string;
  ToplamBiletFiyati: string;
  ToplamNetBiletFiyati: string;
  ToplamVergi: string;
  ToplamServisUcret: string;
  ToplamMinServisUcret: string;
  YetiskinYolcuSayisi: string;
  YetiskinNetFiyat: string;
  YetiskinVergi: string;
  YetiskinServisUcret: string;
  YetiskinMinServisUcret: string;
  YetiskinFirmaKartZorunluMu: string;
  CocukYolcuSayisi: string;
  CocukNetFiyat: string;
  CocukVergi: string;
  CocukServisUcret: string;
  CocukMinServisUcret: string;
  CocukFirmaKartZorunluMu: string;
  BebekYolcuSayisi: string;
  BebekNetFiyat: string;
  BebekVergi: string;
  BebekServisUcret: string;
  BebekMinServisUcret: string;
  BebekFirmaKartZorunluMu: string;
  YasliYolcuSayisi: string;
  YasliNetFiyat: string;
  YasliVergi: string;
  YasliServisUcret: string;
  YasliMinServisUcret: string;
  YasliFirmaKartZorunluMu: string;
  OgrenciYolcuSayisi: string;
  OgrenciNetFiyat: string;
  OgrenciVergi: string;
  OgrenciServisUcret: string;
  OgrenciMinServisUcret: string;
  OgrenciFirmaKartZorunluMu: string;
  OzurluYolcuSayisi: string;
  OzurluNetFiyat: string;
  OzurluVergi: string;
  OzurluServisUcret: string;
  OzurluMinServisUcret: string;
  OzurluFirmaKartZorunluMu: string;
  AskerYolcuSayisi: string;
  AskerNetFiyat: string;
  AskerVergi: string;
  AskerServisUcret: string;
  AskerMinServisUcret: string;
  AskerFirmaKartZorunluMu: string;
  GencYolcuSayisi: string;
  GencNetFiyat: string;
  GencVergi: string;
  GencServisUcret: string;
  GencMinServisUcret: string;
  GencFirmaKartZorunluMu: string;
  OgretmenYolcuSayisi: string;
  OgretmenNetFiyat: string;
  OgretmenVergi: string;
  OgretmenServisUcret: string;
  OgretmenMinServisUcret: string;
  OgretmenFirmaKartZorunluMu: string;
  BasinYolcuSayisi: string;
  BasinNetFiyat: string;
  BasinVergi: string;
  BasinServisUcret: string;
  BasinMinServisUcret: string;
  BasinFirmaKartZorunluMu: string;
  GaziYolcuSayisi: string;
  GaziNetFiyat: string;
  GaziVergi: string;
  GaziServisUcret: string;
  GaziMinServisUcret: string;
  GaziFirmaKartZorunluMu: string;
  AracSurucuYolcuSayisi: string;
  AracSurucuNetFiyat: string;
  AracSurucuVergi: string;
  AracSurucuServisUcret: string;
  AracSurucuMinServisUcret: string;
  AracSurucuFirmaKartZorunluMu: string;
  EkCocukYolcuSayisi: string;
  EkCocukNetFiyat: string;
  EkCocukVergi: string;
  EkCocukServisUcret: string;
  EkCocukMinServisUcret: string;
  EkCocukFirmaKartZorunluMu: string;
  IndirimliYolcuSayisi: string;
  IndirimliNetFiyat: string;
  IndirimliVergi: string;
  IndirimliServisUcret: string;
  IndirimliMinServisUcret: string;
  IndirimliFirmaKartZorunluMu: string;
  Odeme3DSecureAktifMi: string;
  Odeme3DSecureZorunluMu: string;
  PaypalUstLimit: string;
  YolcuDogumTarihiZorunluMu: string;
  YolcuPasaportNoZorunluMu: string;
  EmailZorunluMu: string;
  BaServisUcret: string;
  KaServisUcret: string;
  MaxServisUcret: string;
  RezervasyonAktifMi: string;
};

export type PaymentRules = {
  Odeme3DSecureAktifMi: string;
  Odeme3DSecureZorunluMu: string;
  AcikParaliOdemeAktifMi: string;
  OnOdemeAktifMi: string;
  ParakodOdemeAktifMi: string;
  BkmOdemeAktifMi: string;
  PaypalOdemeAktifMi: string;
  PaypalUstLimit: string;
  HopiAktifMi: string;
  MasterpassAktifMi: string;
  FastPayOdemeAktifMi: string;
};

export type BaggageInfo = {
  YolcuTip: string;
  SegmentNereden: string;
  SegmentNereye: string;
  SegmentTarihSaat: string;
  BagajMiktar: string;
  BagajBirim: string;
};

export type AdditionalServiceRule = {
  EkHizmetKullan: string;
  KullanKoltuk: string;
  KullanBagaj: string;
  KullanYemek: string;
  KullanKabinBagaj: string;
};

export type AdditionalServiceRules = {
  EkHizmetKural: AdditionalServiceRule[];
};

export type PlanePullPriceDataSet = {
  NewDataSet: Array<{
    FiyatListesi: Array<{
      [K in keyof PlanePrices]: [string];
    }>;
    OdemeKurallari: Array<{
      [K in keyof PaymentRules]: [string];
    }>;
    BagajBilgiler?: Array<{
      [K in keyof BaggageInfo]: [string];
    }>;
    EkHizmetKurallar?: Array<{
      [K in keyof AdditionalServiceRules]: [AdditionalServiceRule];
    }>;
  }>;
};

export type PlanePullPriceResponse = SoapEnvelope<PlanePullPriceDataSet>;
