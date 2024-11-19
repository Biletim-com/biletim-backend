import {
  Guarantees,
  PersonalInfo,
} from './create-offer-travel-health-insurance.type';
import { InsuranceCompanyInfos } from './get-price-travel-health-insurance.type';

export type ProductInfos = {
  urunId: number;
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

export type CreateOfferTicketCancellationProtectionInsuranceeResponse = {
  success: boolean;
  data: {
    teklifBilgileri: {
      fiyat: string;
      teklifId: number;
      olusturulmaTarihi: string;
    };
    urunBilgileri: ProductInfos;
    kisiselBilgiler: PersonalInfo;
    sigortaSirketiBilgileri: InsuranceCompanyInfos;
  };
};
