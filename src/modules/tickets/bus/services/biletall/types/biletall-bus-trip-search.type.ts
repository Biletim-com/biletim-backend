import { BusFeature } from './biletall-bus-bus-feature.type';
import { SoapEnvelope } from './biletall-bus-soap-envelope.type';

export type BusSchedule = {
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
  SeyahatSuresi: string;
  SeyahatSuresiGosterimTipi: string;
  YaklasikSeyahatSuresi: string;
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

type BusScheduleDataSet = {
  NewDataSet: Array<{
    Table: Array<{
      [K in keyof BusSchedule]: [string];
    }>;
    OTipOzellik: Array<{
      [K in keyof BusFeature]: [string];
    }>;
  }>;
};

export type BusScheduleResponse = SoapEnvelope<BusScheduleDataSet>;
