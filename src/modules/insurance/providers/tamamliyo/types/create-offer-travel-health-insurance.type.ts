import { InsuranceCompanyInfos } from './get-price-travel-health-insurance-response.type';

export type Tr = {
  'Tıbbi Tedavi'?: string;
  'Tıbbi Nakil'?: string;
  'Tedavi Sonrası İkametgaha Dönüş'?: string;
  'Cenaze Nakli'?: string;
  'Tedavi N. Konaklama Süresinin Uzatılması'?: string;
  'Refakatçi Nakli'?: string;
  'Refakatçi Konaklama Giderleri'?: string;
  'Aileden Birinin Ölümü Sebebi İle Geri Dönüş'?: string;
  'Daimi İkametgahta Meydana Gelen Hasar Nedeniyle Yolculuğun Durdurulması Sonucu Geri Dönüş Seyahati'?: string;
  'Kayıp Bagajın Bulunup Ulaştırılması'?: string;
  'Bagaj Kaybı ve Hasarı'?: string;
  'Acil Mesajların İletilmesi'?: string;
  'Acente İflas ve Taahhüdün Yerine Getirilmemesi'?: string;
  'Ferdi Kaza Ölüm ve Maluliyet'?: string;
  'Genel Bilgi Danışma'?: string;
  'Tıbbi Destek'?: string;
  Rötar?: string;
};

export type En = {
  'Medical Treatment'?: string;
  'Medical Evacuation'?: string;
  'Return to Residence After Treatment'?: string;
  'Repatriation of Remains'?: string;
  'Extension of Medical Treatment Stay'?: string;
  'Companion Transfer'?: string;
  'Companion Accommodation Expenses'?: string;
  'Return Due to Family Member’s Death'?: string;
  'Return Due to Damage at Permanent Residence'?: string;
  'Recovery and Delivery of Lost Baggage'?: string;
  'Baggage Loss and Damage'?: string;
  'Transmission of Urgent Messages'?: string;
  'Agency Bankruptcy or Failure to Fulfill Obligations'?: string;
  'Personal Accident Death and Disability'?: string;
  'General Information Assistance'?: string;
  'Medical Support'?: string;
  Delay?: string;
};

export type Guarantees = {
  tr: Tr;
  en: En;
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
