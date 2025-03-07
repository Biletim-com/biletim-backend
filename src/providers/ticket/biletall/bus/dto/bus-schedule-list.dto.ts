import { BusFeature } from '../types/biletall-bus-feature.type';
import { BusTripSchedule } from '../types/biletall-bus-trip-schedule.type';

export class BusScheduleDto {
  id?: string;
  timeOfDay?: string;
  companyNumber?: string;
  companyLogo?: string;
  companyName?: string;
  localTime?: string;
  localInternetTime?: string;
  date?: string;
  time?: string;
  dayEnd?: string;
  routeNumber?: string;
  initialDeparturePlace?: string;
  finalArrivalPlace?: string;
  departurePlace?: string;
  arrivalPlace?: string;
  initialDeparturePointId?: string;
  initialDeparturePoint?: string;
  departurePointId?: string;
  departurePoint?: string;
  arrivalPointId?: string;
  arrivalPoint?: string;
  finalArrivalPointId?: string;
  finalArrivalPoint?: string;
  busType?: string;
  busSeatArrangementType?: string;
  busTypeDescription?: string;
  busPhone?: string;
  busPlate?: string;
  travelDuration?: string;
  travelDurationDisplayType?: string;
  approximateTravelDuration?: string;
  ticketPrice1?: string;
  internetTicketPrice?: string;
  classDifference?: string;
  maxReservationTime?: string;
  tripType?: string;
  tripTypeDescription?: string;
  routeTripNumber?: string;
  busTypeClass?: string;
  tripTrackingNumber?: string;
  totalSaleCount?: string;
  occupancyRuleExists?: string;
  busTypeFeature?: string;
  normalTicketPrice?: string;
  isFullTrip?: string;
  facilities?: string;
  tripAvailableSeatCount?: string;
  departureTerminalName?: string;
  departureTerminalNameTimes?: string;
  maximumReserveDateTime?: string;
  route?: string;
  isCardRequired?: string;
  isTicketCancellationActive?: string;
  isOpenMoneyUsageActive?: string;
  cancellationPeriodUntilDepartureMinutes?: string;
  companyTripDescription?: string;
  isSalesRedirected?: string;
  seatSelectionAvailable?: string;
  tripCode?: string;

  constructor(schedule: BusTripSchedule) {
    this.id = schedule.ID;
    this.timeOfDay = schedule.Vakit;
    this.companyNumber = schedule.FirmaNo;
    this.companyName = schedule.FirmaAdi;
    this.companyLogo = `https://eticket.ipektr.com/wsbos3/LogoVer.Aspx?fnum=${schedule.FirmaNo}`;
    this.localTime = schedule.YerelSaat;
    this.localInternetTime = schedule.YerelInternetSaat;
    this.date = schedule.Tarih;
    this.time = schedule.Saat;
    this.dayEnd = schedule.GunBitimi;
    this.routeNumber = schedule.HatNo;
    this.initialDeparturePlace = schedule.IlkKalkisYeri;
    this.finalArrivalPlace = schedule.SonVarisYeri;
    this.departurePlace = schedule.KalkisYeri;
    this.arrivalPlace = schedule.VarisYeri;
    this.initialDeparturePointId = schedule.IlkKalkisNoktaID;
    this.initialDeparturePoint = schedule.IlkKalkisNokta;
    this.departurePointId = schedule.KalkisNoktaID;
    this.departurePoint = schedule.KalkisNokta;
    this.arrivalPointId = schedule.VarisNoktaID;
    this.arrivalPoint = schedule.VarisNokta;
    this.finalArrivalPointId = schedule.SonVarisNoktaID;
    this.finalArrivalPoint = schedule.SonVarisNokta;
    this.busType = schedule.OtobusTipi;
    this.busSeatArrangementType = schedule.OtobusKoltukYerlesimTipi;
    this.busTypeDescription = schedule.OTipAciklamasi;
    this.busPhone = schedule.OtobusTelefonu;
    this.busPlate = schedule.OtobusPlaka;
    this.travelDuration = schedule.SeyahatSuresi;
    this.travelDurationDisplayType = schedule.SeyahatSuresiGosterimTipi;
    this.approximateTravelDuration = schedule.YaklasikSeyahatSuresi;
    this.ticketPrice1 = schedule.BiletFiyati1;
    this.internetTicketPrice = schedule.BiletFiyatiInternet;
    this.classDifference = schedule.Sinif_Farki;
    this.maxReservationTime = schedule.MaxRzvZamani;
    this.tripType = schedule.SeferTipi;
    this.tripTypeDescription = schedule.SeferTipiAciklamasi;
    this.routeTripNumber = schedule.HatSeferNo;
    this.busTypeClass = schedule.O_Tip_Sinif;
    this.tripTrackingNumber = schedule.SeferTakipNo;
    this.totalSaleCount = schedule.ToplamSatisAdedi;
    this.occupancyRuleExists = schedule.DolulukKuraliVar;
    this.busTypeFeature = schedule.OTipOzellik;
    this.normalTicketPrice = schedule.NormalBiletFiyati;
    this.isFullTrip = schedule.DoluSeferMi;
    this.facilities = schedule.Tesisler;
    this.tripAvailableSeatCount = schedule.SeferBosKoltukSayisi;
    this.departureTerminalName = schedule.KalkisTerminalAdi;
    this.departureTerminalNameTimes = schedule.KalkisTerminalAdiSaatleri;
    this.maximumReserveDateTime = schedule.MaximumRezerveTarihiSaati;
    this.route = schedule.Guzergah;
    this.isCardRequired = schedule.KKZorunluMu;
    this.isTicketCancellationActive = schedule.BiletIptalAktifMi;
    this.isOpenMoneyUsageActive = schedule.AcikParaKullanimAktifMi;
    this.cancellationPeriodUntilDepartureMinutes =
      schedule.SefereKadarIptalEdilebilmeSuresiDakika;
    this.companyTripDescription = schedule.FirmaSeferAciklamasi;
    this.isSalesRedirected = schedule.SatisYonlendirilecekMi;
    this.seatSelectionAvailable = schedule.KoltukSecimiVar;
    this.tripCode = schedule.SeferKod;
  }
}
export class BusFeaturesDto {
  typeFeature: string;
  typeFeatureDescription: string;
  typeFeatureDetail: string;
  typeFeatureIcon: string;

  constructor(feature: BusFeature) {
    this.typeFeature = feature.O_Tip_Ozellik;
    this.typeFeatureDescription = feature.O_Tip_Ozellik_Aciklama;
    this.typeFeatureDetail = feature.O_Tip_Ozellik_Detay;
    this.typeFeatureIcon = feature.O_Tip_Ozellik_Icon;
  }
}

export class BusScheduleListParserDto {
  typeFeature?: string;
  typeFeatureDescription?: string;
  typeFeatureDetail?: string;
  typeFeatureIcon?: string;
  constructor(
    public schedulesAndFeatures: {
      schedule: BusScheduleDto;
      features: BusFeaturesDto[];
    }[],
  ) {}
}

export class BusScheduleListResponseDto {
  constructor(
    public departureSchedulesAndFeatures: BusScheduleListParserDto,
    public returnSchedulesAndFeatures?: BusScheduleListParserDto,
  ) {}
}
