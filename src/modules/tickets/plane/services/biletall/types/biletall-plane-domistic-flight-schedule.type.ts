import { SoapEnvelope } from '@app/common/types';

export type FlightOption = {
  ID: string;
  FiyatP: string;
  FiyatE: string;
  FiyatB: string;
  ServisUcretP: string;
  ServisUcretE: string;
  ServisUcretB: string;
  ToplamFiyatE: string;
  ToplamFiyatB: string;
  ToplamServisUcretE: string;
  ToplamServisUcretB: string;
  BagajE: string;
  BagajB: string;
  Vakit: string;
  ID2: string;
  FirmaNo: string;
};

export type FlightSegment = {
  ID: string;
  SecenekID: string;
  FirmaID: string;
  Firma: string;
  FirmaAd: string;
  FirmaKampanyaAciklama: string;
  SeferNo: string;
  FirmaSeferNo: string;
  SeferKod: string;
  Kalkis: string;
  Varis: string;
  KalkisSehir: string;
  VarisSehir: string;
  KalkisHavaAlan: string;
  VarisHavaAlan: string;
  KalkisTarih: string;
  VarisTarih: string;
  Sure: string;
  UcakTip: string;
  SinifP: string;
  SinifE: string;
  SinifB: string;
  KabinSinifP: string;
  KabinSinifE: string;
  KabinSinifB: string;
  KoltukP: string;
  KoltukE: string;
  KoltukB: string;
  BagajP: string;
  BagajE: string;
  BagajB: string;
  RotaNo: string;
  KalanKoltukSayisiServistenMiGeliyor: string;
  YemekUcretliMi: string;
  KoridorSayi: string;
  KatSayi: string;
  KoltukMesafe: string;
  SegmentID2: string;
};

export type SegmentClass = {
  SegmentID2: string;
  SecenekUcretID: string;
  SinifKod: string;
  KoltukSayi: string;
  KalanKoltukSayisiServistenMiGeliyor: string;
  Ucret: string;
  EksikKoltukMu: string;
};

export type OptionFare = {
  ID: string;
  SecenekID2: string;
  SinifAd: string;
  SinifTip: string;
  KoltukSayi: string;
  KalanKoltukSayisiServistenMiGeliyor: string;
  Bagaj: string;
  TekYolcuUcret: string;
  TekYolcuServisUcret: string;
  ToplamUcret: string;
  ToplamServisUcret: string;
  Aciklama: string;
};

export type OptionFareDetail = {
  ID: string;
  SecenekUcretID: string;
  Tip: string;
  Aciklama: string;
};

type DomesticFlightDataSet = {
  GidisSecenekler: Array<{
    [K in keyof FlightOption]: [string];
  }>;
  GidisSegmentler: Array<{
    [K in keyof FlightSegment]: [string];
  }>;
  DonusSecenekler?: Array<{
    [K in keyof FlightOption]: [string];
  }>;
  DonusSegmentler?: Array<{
    [K in keyof FlightSegment]: [string];
  }>;
  SegmentSiniflar: Array<{
    [K in keyof SegmentClass]: [string];
  }>;
  SecenekUcretler: Array<{
    [K in keyof OptionFare]: [string];
  }>;
  SecenekUcretDetaylar: Array<{
    [K in keyof OptionFareDetail]: [string];
  }>;
};

export type DomesticFlightResponse = SoapEnvelope<DomesticFlightDataSet>;
