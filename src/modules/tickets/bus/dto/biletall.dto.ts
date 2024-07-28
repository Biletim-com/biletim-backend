export class CompanyRequestDto {
  FirmaNo: string;
}

// request to be sent to get the available dates
export class ScheduleListRequestDto {
  FirmaNo: number;
  KalkisNoktaID: number;
  VarisNoktaID: number;
  Tarih: string;
  AraNoktaGelsin?: boolean;
  IslemTipi: number;
  YolcuSayisi = 1;
  Ip: string;
}

// info regarding the bus
// plate, driver...
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

// check wether the passenger can buy the requested ticket based on their gender
export class BusSeatControlRequestDto {
  FirmaNo: number;
  KalkisNoktaID: number;
  VarisNoktaID: number;
  Tarih: string;
  Saat: string;
  HatNo: number;
  IslemTipi: number;
  SeferTakipNo: string;
  Ip: string;
  Koltuklar: BusSeatRequestDto[];
}
export class BusSeatRequestDto {
  KoltukNo: number;
  // male - 2
  // female - 1
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

// purchase
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
  SeferTakipNo: string;
  Tarih: string;
}
