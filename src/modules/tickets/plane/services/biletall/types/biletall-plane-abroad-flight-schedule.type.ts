import { SoapEnvelope } from '@app/common/types';

export type AbroadFlightOption = {
  ID: string;
  VFiyat: string;
  NFiyat: string;
  YetiskinSayi: string;
  CocukSayi: string;
  BebekSayi: string;
  YetiskinVFiyat: string;
  CocukVFiyat: string;
  BebekVFiyat: string;
  YetiskinNFiyat: string;
  CocukNFiyat: string;
  BebekNFiyat: string;
  ServisUcreti: string;
  OpsiyonTarihi: string;
  RezervasyonYapilabilirMi: string;
  CharterSeferMi: string;
  FirmaNo: string;
  Saglayici: string;
};

export type AbroadFlightSegment = {
  ID: string;
  SecenekID: string;
  UcusID: string;
  Aktarma: string;
  SeferNo: string;
  SeferKod: string;
  HavaYolu: string;
  HavaYoluKod: string;
  KalkisKod: string;
  KalkisUlkeID: string;
  KalkisUlke: string;
  KalkisSehir: string;
  KalkisHavaAlani: string;
  VarisKod: string;
  VarisUlkeID: string;
  VarisUlke: string;
  VarisSehir: string;
  VarisHavaAlani: string;
  UcusSuresi: string;
  KalkisTarih: string;
  VarisTarih: string;
  Vakit: string;
  Sinif: string;
  KalanKoltukSayi: string;
  FiyatPaketTanimi: string;
  FiyatPaketAnahtari: string;
};

type AbroadFlightDataSet = {
  Secenekler: Array<{
    [K in keyof AbroadFlightOption]: [string];
  }>;
  Segmentler: Array<{
    [K in keyof AbroadFlightSegment]: [string];
  }>;
  DonusSegmentler?: Array<{
    [K in keyof AbroadFlightSegment]: [string];
  }>;
};

export type AbroadFlightResponse = SoapEnvelope<AbroadFlightDataSet>;
