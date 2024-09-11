import { SoapEnvelope } from '@app/modules/tickets/bus/services/biletall/types/biletall-soap-envelope.type';

export type PNR = {
  ID: string;
  PNR: string;
  PnrTip: string;
  TakipNo: string;
  Ad: string;
  Soyad: string;
  Tel: string;
  Email: string;
  TCKimlikNo: string;
  FirmaNo: string;
  OpsiyonTarih: string;
  HatirlaticiNot?: string;
  FirmaAciklama?: string;
  SMSGonderimSayi: string;
};

export type PassengerInfo = {
  PNR: string;
  ID: string;
  Ad: string;
  Soyad: string;
  TCKimlikNo: string;
  Cinsiyet: string;
  Tip: string;
  Fiyat: string;
  ServisUcret: string;
  Vergi: string;
  EBiletNo: string;
  KoltukNo: string;
  BinisYer?: string;
  BinisServis?: string;
  InisServis?: string;
  IslemTipi: string;
  IslemTarihi: string;
  Acente: string;
  Kullanici: string;
  AcenteID: string;
  KullaniciID: string;
  CM_AcenteID: string;
  CM_KullaniciID: string;
  Durum1: string;
  Durum1Tarih: string;
  AktifDurum: string;
};

export type SegmentInfo = {
  ID: string;
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
  KalkisTerminal?: string;
  BinisYer?: string;
  BinisServis?: string;
  InisServis?: string;
  BosTarih: string;
  BosSaat: string;
  DonusMu: string;
  SinifTip: string;
  FirmaAd: string;
  FirmaKod: string;
  FirmaID: string;
  BiletIptalAktifMi: string;
};

export type OpenTicketInfo = {
  Tahsilat: string;
  HarcananTutar: string;
  AcikTutar: string;
  KazanilanPuan: string;
  HarcananPuan: string;
  NetPuan: string;
  TakipNo: string;
};

export type CollectionInfo = {
  Tarih: string;
  Acente: string;
  IslemTip: string;
  Tip: string;
  Tutar: string;
};

export type PnrTransactionDetail = {
  PNR: string;
  IslemTipi: string;
  Tarih: string;
  Firma: string;
  KalkisVaris: string;
  KoltukNo: string;
  AdSoyad: string;
  Tutar: string;
};

export type CollectionDetail = {
  ID: string;
  Tarih: string;
  TakipNo: string;
  AcenteID: string;
  KullaniciID: string;
  Tutar: string;
  IslemTip: string;
  OrderID: string;
  TransactionID: string;
  TahsilatID: string;
  Tip: string;
  PosID: string;
  OrderID1: string;
  Tarih1: string;
  KKNo: string;
  KKSahip: string;
  KKSKAy: string;
  KKSKYil: string;
  KKCvv: string;
  Secure3D: string;
  Secure3DSonuc: string;
  Tutar1: string;
  AcenteKrediKartID: string;
};

export type SeatNumbers = {
  PNRSegmentID: string;
  PNRYolcuID: string;
  BagajMiktar: string;
  BagajBirim: string;
};

export type PnrSearchDataSet = {
  PNR: Array<{ [K in keyof PNR]: [string] }>;
  Yolcu: Array<{ [K in keyof PassengerInfo]: [string] }>;
  Segment: Array<{ [K in keyof SegmentInfo]: [string] }>;
  AcikBilet?: Array<{ [K in keyof OpenTicketInfo]: [string] }>;
  Tahsilat: Array<{ [K in keyof CollectionInfo]: [string] }>;
  PNRIslemDetay: Array<{ [K in keyof PnrTransactionDetail]: [string] }>;
  TahsilatDetay: Array<{ [K in keyof CollectionDetail]: [string] }>;
  KoltukNolar?: Array<{ [K in keyof SeatNumbers]: [string] }>;
};

export type PnrSearchResponse = SoapEnvelope<PnrSearchDataSet>;
