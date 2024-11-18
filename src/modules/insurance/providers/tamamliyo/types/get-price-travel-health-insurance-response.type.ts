export type tr = {
  VIZE: string;
  'TIBBİ TEDAVİ TEMİNATI': string;
  'TIBBİ NAKİL TEMİNATI': string;
  'TEDAVİ S. İKAMETGAHA DÖNÜŞ': string;
  'CENAZE NAKLİ': string;
  'TIBBİ BİLGİ VE DANIŞMA': string;
};

export type en = {
  Visa: string;
  'Medical Treatment Coverage': string;
  'Medical Transfer Coverage': string;
  'Return to Permanent Residence after Treatment': string;
  'Repatriation of Mortal Remains': string;
  'Medical Information and Consultation': string;
};

export type Guarantees = {
  tr: tr;
  en: en;
};

export type ProductInfos = {
  urunId: number;
  fiyat: string;
  fiyatEuro: string;
  fiyatUsd: string;
  urunAdi: string;
  urunAdiMultiple: {
    tr: string;
    en: string;
  };
  urunTanimi: string;
  urunKategoriBaslik: string;
  urunKategoriAciklama: string;
  urunKategoriMultiple: {
    tr: string;
    en: string;
  };
  teminatlar: Guarantees;
};

export type InsuranceCompanyInfos = {
  sigortaSirketiId: number;
  kisaAdi: string;
  tamAdi: string;
  yayinci: string;
  yayinciMultiple: {
    tr: string;
    en: string;
  };
};

export type GetPriceTravelHealthInsuranceResponse = {
  success: boolean;
  data: {
    urunBilgileri: ProductInfos;
    sigortaSirketiBilgileri: InsuranceCompanyInfos;
  };
};
