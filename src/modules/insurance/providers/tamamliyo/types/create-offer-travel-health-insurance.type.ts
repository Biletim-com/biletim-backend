import { InsuranceCompanyInfos } from './get-price-travel-health-insurance.type';

export type Guarantees = {
  tr: Record<string, any>;
  en: Record<string, any>;
};

export type ProductInfos = {
  urunId: number;
  fiyat: string;
  fiyatUsd: string;
  fiyatEuro: string;
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

export type PersonalInfo = {
  ad: string;
  soyad: string;
  tcKimlikNo: string;
  dogumTarihi: string;
  cinsiyet: string;
  gsmNo: string;
  email: string;
};

export type CreateOfferTravelHealthInsuranceResponse = {
  success: boolean;
  data: {
    teklifBilgileri: {
      fiyat: string;
      fiyatUsd: string;
      fiyatEuro: string;
      teklifId: number;
      olusturulmaTarihi: string;
    };
    urunBilgileri: ProductInfos;
    kisiselBilgiler: PersonalInfo;
    sigortaSirketiBilgileri: InsuranceCompanyInfos;
  };
};
