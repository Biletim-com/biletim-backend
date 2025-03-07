import {
  AbroadFlightOption,
  AbroadFlightSegment,
} from '../types/biletall-plane-abroad-flight-schedule.type';

export class AbroadFlightOptionDto {
  id: string;
  vPrice: string;
  nPrice: string;
  adultCount: string;
  childCount: string;
  babyCount: string;
  adultVPrice: string;
  childVPrice: string;
  babyVPrice: string;
  adultNPrice: string;
  childNPrice: string;
  babyNPrice: string;
  serviceFee: string;
  optionDate: string;
  minServiceFee: string;
  isReservable: string;
  isCharterFlight: string;
  companyNumber: string;
  provider: string;

  constructor(option: AbroadFlightOption) {
    this.id = option.ID;
    this.vPrice = option.VFiyat;
    this.nPrice = option.NFiyat;
    this.adultCount = option.YetiskinSayi;
    this.childCount = option.CocukSayi;
    this.babyCount = option.BebekSayi;
    this.adultVPrice = option.YetiskinVFiyat;
    this.childVPrice = option.CocukVFiyat;
    this.babyVPrice = option.BebekVFiyat;
    this.adultNPrice = option.YetiskinNFiyat;
    this.childNPrice = option.CocukNFiyat;
    this.babyNPrice = option.BebekNFiyat;
    this.serviceFee = option.ServisUcreti;
    this.optionDate = option.OpsiyonTarihi;
    this.minServiceFee = option.MinServisUcreti;
    this.isReservable = option.RezervasyonYapilabilirMi;
    this.isCharterFlight = option.CharterSeferMi;
    this.companyNumber = option.FirmaNo;
    this.provider = option.Saglayici;
  }
}

export class AbroadFlightSegmentDto {
  id: string;
  optionId: string;
  flightId: string;
  transfer: string;
  companyFlightNumber: string;
  flightNumber: string;
  flightCode: string;
  airline: string;
  airlineCode: string;
  departureAirport: string;
  departureCountryId: string;
  departureCountry: string;
  departureCity: string;
  departureAirportName: string;
  arrivalAirport: string;
  arrivalCountryId: string;
  arrivalCountry: string;
  arrivalCity: string;
  arrivalAirportName: string;
  flightDuration: string;
  departureDate: string;
  arrivalDate: string;
  time: string;
  classType: string;
  remainingSeatCount: string;
  totalTravelTime: string;
  isSeatCountFromService: string;
  aircraftType: string;
  corridorCount: string;
  floorCount: string;
  seatDistance: string;
  baggage: string;
  ruleKey: string;
  pricePackageDescription: string;
  pricePackageKey: string;

  constructor(segment: AbroadFlightSegment) {
    this.id = segment.ID;
    this.optionId = segment.SecenekID;
    this.flightId = segment.UcusID;
    this.transfer = segment.Aktarma;
    this.flightNumber = segment.SeferNo;
    this.companyFlightNumber = segment.FirmaSeferNo;
    this.flightCode = segment.SeferKod;
    this.airline = segment.HavaYolu;
    this.airlineCode = segment.HavaYoluKod;
    this.departureAirport = segment.KalkisKod;
    this.departureCountryId = segment.KalkisUlkeID;
    this.departureCountry = segment.KalkisUlke;
    this.departureCity = segment.KalkisSehir;
    this.departureAirportName = segment.KalkisHavaAlani;
    this.arrivalAirport = segment.VarisKod;
    this.arrivalCountryId = segment.VarisUlkeID;
    this.arrivalCountry = segment.VarisUlke;
    this.arrivalCity = segment.VarisSehir;
    this.arrivalAirportName = segment.VarisHavaAlani;
    this.flightDuration = segment.UcusSuresi;
    this.departureDate = segment.KalkisTarih;
    this.arrivalDate = segment.VarisTarih;
    this.time = segment.Vakit;
    this.classType = segment.Sinif;
    this.remainingSeatCount = segment.KalanKoltukSayi;
    this.totalTravelTime = segment.ToplamSeyahatSuresi;
    this.isSeatCountFromService = segment.KalanKoltukSayisiServistenMiGeliyor;
    this.aircraftType = segment.UcakTip;
    this.corridorCount = segment.KoridorSayi;
    this.floorCount = segment.KatSayi;
    this.seatDistance = segment.KoltukMesafe;
    this.baggage = segment.Bagaj;
    this.ruleKey = segment.KuralAnahtar;
    this.pricePackageDescription = segment.FiyatPaketTanimi;
    this.pricePackageKey = segment.FiyatPaketAnahtari;
  }
}

export class AbroadFlightDto {
  flightId: string;
  flightOption: AbroadFlightOptionDto;
  segments: AbroadFlightSegmentDto[];
}

export class AbroadFlightScheduleDto {
  constructor(
    public departureFlights: AbroadFlightDto[],
    public returnFlights: AbroadFlightDto[] = [],
    public operationId?: string | null,
  ) {}
}
