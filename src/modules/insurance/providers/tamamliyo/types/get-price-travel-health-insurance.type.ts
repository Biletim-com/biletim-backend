import { Guarantees } from './create-offer-travel-health-insurance.type';

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
