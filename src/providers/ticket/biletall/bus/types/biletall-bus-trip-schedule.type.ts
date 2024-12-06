import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';
import { BusFeature } from './biletall-bus-feature.type';

export type BusTripSchedule = {
  ID: string;
  Vakit: string;
  FirmaNo: string;
  FirmaAdi: string;
  YerelSaat: string;
  YerelInternetSaat: string;
  Tarih: string;
  GunBitimi: string;
  Saat: string;
  HatNo: string;
  IlkKalkisYeri: string;
  SonVarisYeri: string;
  KalkisYeri: string;
  VarisYeri: string;
  IlkKalkisNoktaID: string;
  IlkKalkisNokta: string;
  KalkisNoktaID: string;
  KalkisNokta: string;
  VarisNoktaID: string;
  VarisNokta: string;
  SonVarisNoktaID: string;
  SonVarisNokta: string;
  OtobusTipi: string;
  OtobusKoltukYerlesimTipi: string;
  OTipAciklamasi: string;
  OtobusTelefonu: string;
  OtobusPlaka: string;
  SeyahatSuresi?: string;
  SeyahatSuresiGosterimTipi: string;
  YaklasikSeyahatSuresi?: string;
  BiletFiyati1: string;
  BiletFiyatiInternet: string;
  Sinif_Farki: string;
  MaxRzvZamani: string;
  SeferTipi: string;
  SeferTipiAciklamasi: string;
  HatSeferNo: string;
  O_Tip_Sinif: string;
  SeferTakipNo: string;
  ToplamSatisAdedi: string;
  DolulukKuraliVar: string;
  OTipOzellik: string;
  NormalBiletFiyati: string;
  DoluSeferMi: string;
  Tesisler: string;
  SeferBosKoltukSayisi: string;
  KalkisTerminalAdi: string;
  KalkisTerminalAdiSaatleri: string;
  MaximumRezerveTarihiSaati: string;
  Guzergah: string;
  KKZorunluMu: string;
  BiletIptalAktifMi: string;
  AcikParaKullanimAktifMi: string;
  SefereKadarIptalEdilebilmeSuresiDakika: string;
  FirmaSeferAciklamasi: string;
  SatisYonlendirilecekMi: string;
  KoltukSecimiVar: string;
  SeferKod: string;
};

type BusTripScheduleAndFeaturesDataSet = {
  NewDataSet: Array<{
    Table: Array<{
      [K in keyof BusTripSchedule]: [string];
    }>;
    OTipOzellik: Array<{
      [K in keyof BusFeature]: [string];
    }>;
  }>;
};

export type BusTripScheduleAndFeaturesResponse =
  SoapEnvelope<BusTripScheduleAndFeaturesDataSet>;
