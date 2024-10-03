import { SoapEnvelope } from '@app/common/types';

export type PnrBus = {
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
  OfflineMi: string;
  UyeID: string;
  CM_EFaturaBireyselMi: string;
  AydinlatmaSozlesmeID: string;
  AcikRizaSozlesmeID: string;
  HizmetSozlesmeID: string;
  UlkeTelefonKodu: string;
  ByBiletallApi: string;
  FirmaNo: string;
  ToplamIndirim: string;
  ServisUcretIndirim: string;
};

export type PassengerBus = {
  PNR: string;
  ID: string;
  PNRID: string;
  Ad: string;
  Soyad: string;
  TCKimlikNo: string;
  Cinsiyet: string;
  Tip: string;
  Fiyat: string;
  ServisUcret: string;
  Vergi: string;
  EBiletNo: string;
  YakitHarc: string;
  AlanVergi: string;
  ThyCipVarMi: string;
  TCVatandasiMi: string;
  BiletIptalHizmetiUcret: string;
  KoltukNo: string;
  BinisYer: string;
  BinisServis: string;
  InisServis: string;
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

export type SegmentBus = {
  ID: string;
  PNRID: string;
  Kalkis: string;
  Varis: string;
  SeferNo: string;
  HatNo: string;
  KalkisTarih: string;
  VarisTarih: string;
  TasiyiciFirma: string;
  AracTipi: string;
  Sinif: string;
  SeferSure: string;
  SeferTip: string;
  PeronNo: string;
  KalkisTerminal: string;
  BosTarih: string;
  BosSaat: string;
  SeferTakipNo: string;
  DonusMu: string;
  KalkisKod: { KalkisKod: string };
  VarisKod: { VarisKod: string };
  KalkisNoktaID: string;
  VarisNoktaID: string;
  CiktilardaKaraAramaNoktalariGozuksunMu: string;
  SeyahatSuresiGosterimTipi: string;
  SinifTip: string;
  FirmaAd: string;
  FirmaKod: string;
  FirmaID: string;
  FirmaNo: string;
  BiletIptalAktifMi: string;
  BiletAcigaAlAktifMi: string;
  SeyahatTipi: string;
  SeferSureDk: string;
  YaklasikSeyahatSuresi: string;
  KalkisKaraNoktaID: string;
  KalkisKaraNokta: string;
  VarisKaraNoktaID: string;
  VarisKaraNokta: string;
  SefereKadarIptalEdilebilmeSuresiDakika: string;
};

export type OpenTicketBus = {
  Tahsilat: string;
  HarcananTutar: string;
  AcikTutar: string;
  KazanilanPuan: string;
  HarcananPuan: string;
  NetPuan: string;
  TakipNo: string;
};

export type MembershipBus = {
  MilparaKartNo: string;
  Ad: string;
  Soyad: string;
  Email: string;
  CepTel: string;
  TcKimlikNo: string;
  Cinsiyet: string;
};

export type CollectionBus = {
  Tarih: string;
  Acente: string;
  IslemTip: string;
  Tip: string;
  Tutar: string;
};

export type PnrTransactionDetailBus = {
  PNR: string;
  IslemTipi: string;
  Tarih: string;
  Firma: string;
  KalkisVaris: string;
  KoltukNo: string;
  AdSoyad: string;
  Tutar: string;
};

export type InvoiceBus = {
  ID: string;
  PNRID: string;
  FaturaTip: string;
};

export type CommissionBus = {
  Acente: string;
  Tutar: string;
  Oran: string;
};

export type SeatNumbersBus = {
  KoltukNo: string;
  PNRSegmentID: string;
  PNRYolcuID: string;
};

export type AgencyPrepaymentBus = {
  TaksitSayi: string;
  VadeFark: string;
  Tutar: string;
};

export type PnrExtraServiceSegmentBus = {
  ID: string;
  PNRID: string;
  Kalkis: string;
  Varis: string;
  SeferNo: string;
  HatNo: string;
  KalkisTarih: string;
  VarisTarih: string;
  TasiyiciFirma: string;
  AracTipi: string;
  Sinif: string;
  SeferSure: string;
  SeferTip: string;
  PeronNo: string;
  KalkisTerminal: string;
  BosTarih: string;
  BosSaat: string;
  SeferTakipNo: string;
  DonusMu: string;
  KalkisKod: { KalkisKod: string };
  VarisKod: { VarisKod: string };
  KalkisNoktaID: string;
  VarisNoktaID: string;
  CiktilardaKaraAramaNoktalariGozuksunMu: string;
  SeyahatSuresiGosterimTipi: string;
  SinifTip: string;
  FirmaAd: string;
  FirmaKod: string;
  FirmaID: string;
  FirmaNo: string;
  BiletIptalAktifMi: string;
  BiletAcigaAlAktifMi: string;
};

export type PnrSearchBusDataSet = {
  Bilet: Array<{
    PNR: Array<{
      [K in keyof PnrBus]: [string];
    }>;
    Yolcu: Array<{
      [K in keyof PassengerBus]: [string];
    }>;
    Segment: Array<{
      [K in keyof SegmentBus]: [string];
    }>;
    AcikBilet: Array<{
      [K in keyof OpenTicketBus]: [string];
    }>;
    Uyelik: Array<{
      [K in keyof MembershipBus]: [string];
    }>;
    Tahsilat: Array<{
      [K in keyof CollectionBus]: [string];
    }>;
    PNRIslemDetay: Array<{
      [K in keyof PnrTransactionDetailBus]: [string];
    }>;
    Fatura: Array<{
      [K in keyof InvoiceBus]: [string];
    }>;
    Komisyon: Array<{
      [K in keyof CommissionBus]: [string];
    }>;
    KoltukNolar: Array<{
      [K in keyof SeatNumbersBus]: [string];
    }>;
    AcenteOnOdeme: Array<{
      [K in keyof AgencyPrepaymentBus]: [string];
    }>;
    PnrEkHizmetSegment: Array<{
      [K in keyof PnrExtraServiceSegmentBus]: string[];
    }>;
  }>;
};

export type PnrSearchBusResponse = SoapEnvelope<PnrSearchBusDataSet>;
