// TODO: export each class to their own file

export class CompanyRequestDto {
  FirmaNo: string;
}

export class ScheduleListRequestDto {
  FirmaNo: number;
  KalkisNoktaID: number;
  VarisNoktaID: number;
  Tarih: string;
  AraNoktaGelsin?: number;
  IslemTipi: number;
  YolcuSayisi = 1;
  Ip: string;
}

export class BusSearchRequestDto {
  FirmaNo: number;
  KalkisNoktaID: number;
  VarisNoktaID: number;
  Tarih: string;
  Saat: string;
  HatNo: number;
  IslemTipi: number;
  YolcuSayisi: number;
  SeferTakipNo: number;
  Ip: string;
}

export class BusSeatControlRequestDto {
  FirmaNo: number;
  KalkisNoktaID: number;
  VarisNoktaID: number;
  Tarih: string;
  Saat: string;
  HatNo: number;
  IslemTipi: number;
  SeferTakipNo: number;
  Ip: string;
  Koltuklar: BusSeatRequestDto[];
}

export class BusSeatRequestDto {
  KoltukNo: number;
  Cinsiyet: number;
}

export class BoardingPointRequestDto {
  FirmaNo: number;
  KalkisNoktaID: number;
  YerelSaat: string;
  HatNo: number;
}

export class ServiceInformationRequestDto {
  FirmaNo: number;
  KalkisNoktaID: number;
  YerelSaat: string;
  HatNo: number;
  Tarih: string;
  Saat: string;
}

export class BusSaleRequestDto {
  FirmaNo: number;
  KalkisNoktaID: number;
  VarisNoktaID: number;
  Tarih: string;
  Saat: string;
  HatNo: number;
  SeferNo: string;
  Passengers: BusPassengerInfoDto[];
  TelefonNo: string;
  Cinsiyet: number;
  ToplamBiletFiyati: number;
  BiletSeriNo = 1;
  OdemeSekli = 0;
  FirmaAciklama: string;
  HatirlaticiNot: string;
  SeyahatTipi = 0;
  WebYolcu: BusPassengerRequestDto;
}

export class BusPassengerInfoDto {
  KoltukNo: number;
  Adi: string;
  Soyadi: string;
  Cinsiyet: number;
  TcVatandasiMi: number;
  TcKimlikNo: string;
  PasaportUlkeKod: string;
  PasaportNo: string;
  BinecegiYer: string;
  ServisYeriKalkis: string;
  ServisYeriVaris: string;
}

export class BusPassengerRequestDto {
  WebUyeNo: number;
  Ip: string;
  Email: string;
  KrediKartNo?: string;
  KrediKartSahip?: string;
  KrediKartGecerlilikTarihi?: string;
  KrediKartCCV2?: string;
  OnOdemeKullan?: number;
  OnOdemeTutar?: number;
  AcikPnrNo?: string;
  AcikPnrSoyad?: string;
  AcikTutar?: number;
  RezervePnrNo?: string;
}

export class BusRouteRequestDto {
  FirmaNo: number;
  HatNo: number;
  KalkisNoktaID: number;
  VarisNoktaID: number;
  BilgiIslemAdi: string;
  SeferTakipNo: number;
  Tarih: string;
}
