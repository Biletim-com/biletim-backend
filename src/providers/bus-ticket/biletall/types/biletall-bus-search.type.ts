import { SoapEnvelope } from '@app/common/types';
import { BusFeature } from './biletall-bus-feature.type';

export type BusTrip = {
  YerelTarihSaat: string;
  InternetTarihSaat: string;
  KalkisAdi: string;
  VarisAdi: string;
  HatNo: string;
  FiyatDegistirebilir: string;
  BiletFiyati1: string;
  BiletFiyati2: string;
  BiletFiyati3: string;
  BiletFiyatiInternet: string;
  BiletFiyatiSinifFarki: string;
  BiletTekKoltukFarki: string;
  BiletFiyatiMisafir: string;
  MisafirBiletSatar: string;
  OzurluIndirmliBiletSatar: string;
  KontenjanliBiletSatar: string;
  RezervasyonAktifMi: string;
  SatisAktifMi: string;
  MaximumRezerveTarihiSaati: string;
  OtobusTip: string;
  OtobusTipSinif: string;
  OtobusTipIkinciKatSira: string;
  OtobusPlaka: string;
  OtobusKaptanAdi: string;
  OtobusHostesAdi: string;
  Okalkti: string;
  OtobusSeferMesaji: string;
  OtobusSubeMesaji: string;
  PeronNo: string;
  KalkisTerminalAdi: string;
  GeceAciklamasi: string;
  MaximumBosBayanYaniSayisi: string;
  SubeBiletPort: string;
  YolcuUyePuanToplam: string;
  YolcuUyePuanCarpan: string;
  DolulukOraniIndirimiYapildi: string;
  OTipOzellik: string;
  YonuTersKoltuklar: string;
  SubeSatistaTcKimlikNoYazmakZorunlu: string;
  SeyahatSuresi: string;
  SeferTipiAciklamasi: string;
  OTipAciklamasi: string;
  FirmaEnUygunFiyatAktifMi: string;
  OtobusMesaj: string;
  Tesisler: string;
  Odeme3DSecureAktifMi: string;
  Odeme3DSecureZorunluMu: string;
  PaypalUstLimit: string;
  MaximumBosBayYaniSayisi: string;
  SatilabilirKoltukSayi: string;
  RezervasyonNedenYapilamaz: string;
  FirmaMaxToplamBiletFiyati: string;
  PasaportNoIleIslemYapilirMi: string;
  FarkliCinsiyetteKoltuklarSecilebilirMi: string;
  OtobusKoltukBoslukSemasi: string;
  OtobusHesKoduZorunluMu: string;
  CiftKoltukTekYolcuyaSatilabilirMi: string;
  TekliKoltuklarDoluysaCiftliKoltuktanSatisYapilabilirMi: string;
  YaklasikSeyahatSuresi: string;
  SeyahatSuresiGosterimTipi: string;
  FarkliFiyattaKoltuklarSecilebilirMi: string;
  BiletIptalAktifMi: string;
  AcikParaKullanimAktifMi: string;
  SefereKadarIptalEdilebilmeSuresiDakika: string;
  KalkisNoktaID: string;
  KalkisNokta: string;
  VarisNoktaID: string;
  VarisNokta: string;
};

export type Seat = {
  KoltukStr: string;
  KoltukNo: string;
  Durum: string;
  DurumYan: string;
  KoltukFiyatiInternet: string;
};

export type TravelType = {
  SeyahatTipi: string;
  SeyahatAdi: string;
  BiletFiyati: string;
  BiletFiyatSinifFarki: string;
  BiletTekKoltukFarki: string;
};

export type PaymentRule = {
  Odeme3DSecureAktifMi: string;
  Odeme3DSecureZorunluMu: string;
  AcikParaliOdemeAktifMi: string;
  OnOdemeAktifMi: string;
  ParakodOdemeAktifMi: string;
  BkmOdemeAktifMi: string;
  PaypalOdemeAktifMi: string;
  PaypalUstLimit: string;
  HopiAktifMi: string;
  MasterpassAktifMi: string;
  FastPayOdemeAktifMi: string;
  GarantiPayOdemeAktifMi: string;
};

type BusResponseDataSet = {
  Otobus: Array<{
    Sefer: Array<{
      [K in keyof BusTrip]: [string];
    }>;
    Koltuk: Array<{
      [K in keyof Seat]: [string];
    }>;
    SeyahatTipleri: Array<{
      [K in keyof TravelType]: [string];
    }>;
    OTipOzellik: Array<{
      [K in keyof BusFeature]: [string];
    }>;
    OdemeKurallari: Array<{
      [K in keyof PaymentRule]: [string];
    }>;
  }>;
};

export type BusResponse = SoapEnvelope<BusResponseDataSet>;
