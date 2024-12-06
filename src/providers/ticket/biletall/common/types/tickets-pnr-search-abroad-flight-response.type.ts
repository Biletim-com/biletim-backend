import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type PnrAbroadFlight = {
  ID: string;
  PNR: string;
  PnrTip: string;
  TakipNo: string;
  Ad: string;
  Soyad: string;
  Tel: string;
  Email: string;
  TCKimlikNo: string;
  HatirlaticiNot: string;
  SMSGonderimSayi: string;
  FaturalansinMi: string;
  BagajBilgileri: string;
  OfflineMi: string;
  UyeID: string;
  CM_EFaturaBireyselMi: string;
  GalileoURLocKod: string;
  GalileoTFPNR: string;
  AydinlatmaSozlesmeID: string;
  AcikRizaSozlesmeID: string;
  HizmetSozlesmeID: string;
  UlkeTelefonKodu: string;
  ByBiletallApi: string;
  FirmaNo: string;
  ToplamIndirim: string;
  ServisUcretIndirim: string;
};

export type PassengerAbroadFlight = {
  PNR: string;
  ID: string;
  PNRID: string;
  Ad: string;
  Soyad: string;
  TCKimlikNo: string;
  Cinsiyet: string;
  DogumTarih: string;
  Tip: string;
  Fiyat: string;
  ServisUcret: string;
  Vergi: string;
  YakitHarc: string;
  AlanVergi: string;
  ThyCipVarMi: string;
  TCVatandasiMi: string;
  BiletIptalHizmetiUcret: string;
  KoltukNo: string;
  IslemTipi: string;
  IslemTarihi: string;
  Acente: string;
  Kullanici: string;
  AcenteID: string;
  KullaniciID: string;
  CM_AcenteID: string;
  CM_KullaniciID: string;
  MerkezAcenteID: string;
  IslemDovizKur: string;
  DovizKurId: string;
  ReissueMu: string;
  EkHizmetMi: string;
  EkHizmetId: string;
  Durum1: string;
  Durum1Tarih: string;
  AktifDurum: string;
};

export type SegmentAbroadFlight = {
  ID: string;
  PNRID: string;
  Kalkis: string;
  Varis: string;
  SeferNo: string;
  KalkisTarih: string;
  VarisTarih: string;
  TasiyiciFirma: string;
  AracTipi: string;
  Sinif: string;
  Kabin: string;
  SeferSure: string;
  DonusMu: string;
  KalkisKod: string;
  VarisKod: string;
  KalkisNoktaID: string;
  VarisNoktaID: string;
  UcakTipID: string;
  SinifTip: string;
  FirmaAd: string;
  FirmaKod: string;
  FirmaID: string;
  FirmaNo: string;
  KalkisHavaalan: string;
  VarisHavaalan: string;
  BiletIptalAktifMi: string;
  BiletAcigaAlAktifMi: string;
  SeyahatTipi: string;
  FirmaSeferNo: string;
  SinifAd: string;
  UcakTip: string;
  KoridorSayi: string;
  KatSayi: string;
  KoltukMesafe: string;
  YemekUcretliMi: string;
  SeferSureDk: string;
  SefereKadarIptalEdilebilmeSuresiDakika: string;
};

export type OpenTicketAbroadFlight = {
  Tahsilat: string;
  HarcananTutar: string;
  AcikTutar: string;
  KazanilanPuan: string;
  HarcananPuan: string;
  NetPuan: string;
  TakipNo: string;
};

export type MembershipAbroadFlight = {
  MilparaKartNo: string;
  Ad: string;
  Soyad: string;
  Email: string;
  CepTel: string;
  TcKimlikNo: string;
  Cinsiyet: string;
};

export type InvoiceAbroadFlight = {
  ID: string;
  PNRID: string;
  FaturaTip: string;
};

export type SeatNumbersAbroadFlight = {
  KoltukNo: string;
  PNRSegmentID: string;
  PNRYolcuID: string;
  BagajBirim: string;
  BagajAdet: string;
  KisiselBagaj: string;
  KabinBagaj: string;
  BagajBilgi: string;
};

export type PnrExtraServiceSegmentAbroadFlight = {
  ID: string;
  PNRID: string;
  Kalkis: string;
  Varis: string;
  SeferNo: string;
  KalkisTarih: string;
  VarisTarih: string;
  TasiyiciFirma: string;
  AracTipi: string;
  Sinif: string;
  Kabin: string;
  SeferSure: string;
  DonusMu: string;
  KalkisKod: string;
  VarisKod: string;
  KalkisNoktaID: string;
  VarisNoktaID: string;
  UcakTipID: string;
  SinifTip: string;
  FirmaAd: string;
  FirmaKod: string;
  FirmaID: string;
  FirmaNo: string;
  KalkisHavaalan: string;
  VarisHavaalan: string;
  BiletIptalAktifMi: string;
  BiletAcigaAlAktifMi: string;
};

export type PaymentRulesAbroadFlight = {
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
  GarantiPayOdemeAktifMi: string;
};

export type PnrSearchAbroadFlightDataSet = {
  Bilet: Array<{
    PNR: Array<{
      [K in keyof PnrAbroadFlight]: [string];
    }>;
    Yolcu: Array<{
      [K in keyof PassengerAbroadFlight]: [string];
    }>;
    Segment: Array<{
      [K in keyof SegmentAbroadFlight]: [string];
    }>;
    AcikBilet: Array<{
      [K in keyof OpenTicketAbroadFlight]: [string];
    }>;
    Uyelik: Array<{
      [K in keyof MembershipAbroadFlight]: [string];
    }>;
    Fatura: Array<{
      [K in keyof InvoiceAbroadFlight]: [string];
    }>;
    KoltukNolar: Array<{
      [K in keyof SeatNumbersAbroadFlight]: [string];
    }>;
    PnrEkHizmetSegment: Array<{
      [K in keyof PnrExtraServiceSegmentAbroadFlight]: [string];
    }>;
    OdemeKurallari: Array<{
      [K in keyof PaymentRulesAbroadFlight]: [string];
    }>;
  }>;
};

export type PnrSearchAbroadFlightResponse =
  SoapEnvelope<PnrSearchAbroadFlightDataSet>;
