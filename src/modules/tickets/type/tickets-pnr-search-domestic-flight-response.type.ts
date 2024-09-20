import { SoapEnvelope } from '../bus/services/biletall/types/biletall-soap-envelope.type';

export type PnrDomesticFlight = {
  ID: string;
  PNR: string;
  PnrTip: string;
  TakipNo: string;
  Ad: string;
  Soyad: string;
  Tel: string;
  Email: string;
  TCKimlikNo: string;
  SMSGonderimSayi: string;
  SabitTel: string;
  FaturalansinMi: string;
  FaturaKisiAd: string;
  FaturaKisiSoyad: string;
  FaturaKisiTCKNo: string;
  FaturaKisiAdres: string;
  OfflineMi: string;
  UyeID: string;
  CM_EFaturaBireyselMi: string;
  AydinlatmaSozlesmeID: string;
  AcikRizaSozlesmeID: string;
  HizmetSozlesmeID: string;
  UlkeTelefonKodu: string;
  FirmaNo: string;
  ToplamIndirim: string;
  ServisUcretIndirim: string;
};

export type PassengerDomesticFlight = {
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
  EBiletNo: string;
  YakitHarc: string;
  AlanVergi: string;
  ThyCipVarMi: string;
  TCVatandasiMi: string;
  BiletIptalHizmetiUcret: string;
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

export type SegmentDomesticFlight = {
  ID: string;
  PNRID: string;
  Kalkis: string;
  Varis: string;
  SeferNo: string;
  KalkisTarih: string;
  VarisTarih: string;
  TasiyiciFirma: string;
  Sinif: string;
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
  SinifAd: string;
  YemekUcretliMi: string;
  SeferSureDk: string;
  SefereKadarIptalEdilebilmeSuresiDakika: string;
};

export type OpenTicketDomesticFlight = {
  Tahsilat: string;
  HarcananTutar: string;
  AcikTutar: string;
  KazanilanPuan: string;
  HarcananPuan: string;
  NetPuan: string;
  TakipNo: string;
};

export type MembershipDomesticFlight = {
  MilparaKartNo: string;
  Ad: string;
  Soyad: string;
  Email: string;
  CepTel: string;
  TcKimlikNo: string;
  Cinsiyet: string;
};

export type CollectionDomesticFlight = {
  Tarih: string;
  Acente: string;
  IslemTip: string;
  Tip: string;
  Tutar: string;
};

export type PnrTransactionDetailDomesticFlight = {
  PNR: string;
  IslemTipi: string;
  Tarih: string;
  Firma: string;
  KalkisVaris: string;
  AdSoyad: string;
  Tutar: string;
};

export type InvoiceDomesticFlight = {
  ID: string;
  PNRID: string;
  FaturaTip: string;
  KisiAd: string;
  KisiSoyad: string;
  KisiTcKimlikNo: string;
  KisiAdres: string;
};

export type CommissionDomesticFlight = {
  Acente: string;
  Tutar: string;
  Oran: string;
};

export type SeatNumbersDomesticFlight = {
  PNRSegmentID: string;
  PNRYolcuID: string;
  BagajMiktar: string;
  BagajBirim: string;
  BagajAdet: string;
  KisiselBagaj: string;
  KabinBagaj: string;
  BagajBilgi: string;
};

export type AgencyPrepaymentDomesticFlight = {
  TaksitSayi: string;
  VadeFark: string;
  Tutar: string;
};

export type PnrExtraServiceSegmentDomesticFlight = {
  ID: string;
  PNRID: string;
  Kalkis: string;
  Varis: string;
  SeferNo: string;
  KalkisTarih: string;
  VarisTarih: string;
  TasiyiciFirma: string;
  Sinif: string;
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
  UcuslarinHavayolundakiSonDurumu: {
    UcuslardaIptalveyaDegisiklikVarMi: string;
  };
};

export type PnrSearchDomesticFlightDataSet = {
  Bilet: Array<{
    PNR: Array<{
      [K in keyof PnrDomesticFlight]: [string];
    }>;
    Yolcu: Array<{
      [K in keyof PassengerDomesticFlight]: [string];
    }>;
    Segment: Array<{
      [K in keyof SegmentDomesticFlight]: [string];
    }>;
    AcikBilet: Array<{
      [K in keyof OpenTicketDomesticFlight]: [string];
    }>;
    Uyelik: Array<{
      [K in keyof MembershipDomesticFlight]: [string];
    }>;
    Tahsilat: Array<{
      [K in keyof CollectionDomesticFlight]: [string];
    }>;
    PNRIslemDetay: Array<{
      [K in keyof PnrTransactionDetailDomesticFlight]: [string];
    }>;
    Fatura: Array<{
      [K in keyof InvoiceDomesticFlight]: [string];
    }>;
    Komisyon: Array<{
      [K in keyof CommissionDomesticFlight]: [string];
    }>;
    KoltukNolar: Array<{
      [K in keyof SeatNumbersDomesticFlight]: [string];
    }>;
    AcenteOnOdeme: Array<{
      [K in keyof AgencyPrepaymentDomesticFlight]: [string];
    }>;
    PnrEkHizmetSegment: Array<{
      [K in keyof PnrExtraServiceSegmentDomesticFlight]: string[];
    }>;
  }>;
};

export type PnrSearchDomesticFlightResponse =
  SoapEnvelope<PnrSearchDomesticFlightDataSet>;
