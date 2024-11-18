import { PersonalInfo } from './create-offer-travel-health-insurance.type';
import { InsuranceCompanyInfos } from './get-price-travel-health-insurance-response.type';

export type Tr = {
  'Otobüs kalkışına 5 dakika kalana kadar %100 iade'?: string;
  '7/24 mail üzerinden iptal ve iade talebi'?: string;
  'Tüm otobüs biletlerinde geçerli'?: string;
  'Bilet İptal Güvencesi, sadece Tamamliyo.com kullanıcılarına özel olarak sağlanan ve son anda değişebilen planlara karşılık bilet bedelini güvence altına alan bir hizmettir'?: string;
  'Bilet İptal Güvencesi ile hiçbir neden göstermeden kalkıştan 5 dakika öncesine kadar biletinizi iptal edebilir ve bilet tutarının %100 geri alabilirsiniz.'?: string;
  'Bilet iptal ve iade güvencesi kalkıştan sadece son 5 dakika öncesine kadar geçerlidir.'?: string;
  'Bilet İptal Güvencesi, promosyonlu ve promosyonsuz her bilette geçerlidir.'?: string;
  'Bilet İptal Güvencesi, sadece bilet satın alımı sırasında alınabilir.'?: string;
  'Güvence kapsamında Tamamliyo.com tarafından bilet iptaline ilişkin ödeme yapılabilmesi için sefer en az 5 dakika kala +90850 241 71 41 numaralı telefondan Tamamliyo.com bilet hattının aranarak veya bilgi@tamamliyo.com adresine mail atılarak bilet iptalinin yapılması ön koşuldur.'?: string;
};

export type En = {
  '100% refund until 5 minutes before bus departure'?: string;
  'Cancellation and refund request via e-mail 24/7'?: string;
  'Valid on all bus tickets'?: string;
  'Ticket Cancellation Assurance is a service that is provided exclusively to Onayliyo.com users and secures the ticket price against plans that may change at the last minute'?: string;
  'With Ticket Cancellation Assurance, you can cancel your ticket up to 5 minutes before departure without giving any reason and get a 100% refund of the ticket amount.'?: string;
  'Ticket cancellation and refund guarantee is only valid until the last 5 minutes before departure.'?: string;
  'Ticket Cancellation Assurance is valid for all tickets with or without promotions.'?: string;
  'Ticket Cancellation Assurance can only be obtained at the time of ticket purchase.'?: string;
  'In order to be able to make payment for ticket cancellation by tamamliyo.com within the scope of the assurance, it is a prerequisite to cancel the ticket by calling the tamamliyo.com ticket line at +90850 241 71 41 or by sending an e-mail to bilgi@tamamliyo.com at least 5 minutes before the flight.'?: string;
};

export type Guarantees = {
  tr: Tr;
  en: En;
};

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
