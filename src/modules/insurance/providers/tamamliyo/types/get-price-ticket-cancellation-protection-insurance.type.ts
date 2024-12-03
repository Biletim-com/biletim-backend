import { Guarantees } from './create-offer-travel-health-insurance.type';
import { InsuranceCompanyInfos } from './get-price-travel-health-insurance.type';

export type GetPriceProductInfosTicketCancellationProtectionInsurance = {
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

export type GetPriceTicketCancellationProtectionInsuranceResponse = {
  success: boolean;
  data: {
    teklifBilgileri: {
      teklifId: number;
      fiyat: string;
      kalkisTarihi: string;
      baslangicTarihi: string;
      bitisTarihi: string;
    };
    urunBilgileri: GetPriceProductInfosTicketCancellationProtectionInsurance;
    sigortaSirketiBilgileri: InsuranceCompanyInfos;
  };
};
