import {
  AgencyPrepaymentBus,
  CollectionBus,
  CommissionBus,
  InvoiceBus,
  MembershipBus,
  OpenTicketBus,
  PassengerBus,
  PnrBus,
  PnrExtraServiceSegmentBus,
  PnrTransactionDetailBus,
  SeatNumbersBus,
  SegmentBus,
} from '../type/tickets-pnr-search-bus-response.type';

export class PnrBusDto {
  id: string;
  pnr: string;
  pnrType: string;
  trackingNumber: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  identificationNumber: string;
  reminderNote: string;
  smsSentCount: string;
  isInvoiced: string;
  isOffline: string;
  memberId: string;
  isIndividualInvoice: string;
  dataPrivacyAgreementId: string;
  explicitConsentAgreementId: string;
  serviceAgreementId: string;
  countryPhoneCode: string;
  isByBiletallApi: string;
  companyNumber: string;
  totalDiscount: string;
  serviceFeeDiscount: string;

  constructor(pnr: PnrBus) {
    this.id = pnr.ID;
    this.pnr = pnr.PNR;
    this.pnrType = pnr.PnrTip;
    this.trackingNumber = pnr.TakipNo;
    this.name = pnr.Ad;
    this.surname = pnr.Soyad;
    this.phone = pnr.Tel;
    this.email = pnr.Email;
    this.identificationNumber = pnr.TCKimlikNo;
    this.reminderNote = pnr.HatirlaticiNot;
    this.smsSentCount = pnr.SMSGonderimSayi;
    this.isInvoiced = pnr.FaturalansinMi;
    this.isOffline = pnr.OfflineMi;
    this.memberId = pnr.UyeID;
    this.isIndividualInvoice = pnr.CM_EFaturaBireyselMi;
    this.dataPrivacyAgreementId = pnr.AydinlatmaSozlesmeID;
    this.explicitConsentAgreementId = pnr.AcikRizaSozlesmeID;
    this.serviceAgreementId = pnr.HizmetSozlesmeID;
    this.countryPhoneCode = pnr.UlkeTelefonKodu;
    this.isByBiletallApi = pnr.ByBiletallApi;
    this.companyNumber = pnr.FirmaNo;
    this.totalDiscount = pnr.ToplamIndirim;
    this.serviceFeeDiscount = pnr.ServisUcretIndirim;
  }
}

export class PassengerBusDto {
  pnr: string;
  id: string;
  pnrId: string;
  name: string;
  surname: string;
  identificationNumber: string;
  gender: string;
  type: string;
  price: string;
  serviceFee: string;
  tax: string;
  eTicketNumber: string;
  fuelCharge: string;
  airportTax: string;
  isThyCip: string;
  isCitizen: string;
  ticketCancellationFee: string;
  seatNumber: string;
  boardingLocation: string;
  boardingService: string;
  arrivalService: string;
  transactionType: string;
  transactionDate: string;
  agency: string;
  user: string;
  agencyId: string;
  userId: string;
  cmAgencyId: string;
  cmUserId: string;
  centralAgencyId: string;
  transactionCurrencyRate: string;
  currencyRateId: string;
  isReissue: string;
  isExtraService: string;
  extraServiceId: string;
  status1: string;
  status1Date: string;
  activeStatus: string;

  constructor(passenger: PassengerBus) {
    this.pnr = passenger.PNR;
    this.id = passenger.ID;
    this.pnrId = passenger.PNRID;
    this.name = passenger.Ad;
    this.surname = passenger.Soyad;
    this.identificationNumber = passenger.TCKimlikNo;
    this.gender = passenger.Cinsiyet;
    this.type = passenger.Tip;
    this.price = passenger.Fiyat;
    this.serviceFee = passenger.ServisUcret;
    this.tax = passenger.Vergi;
    this.eTicketNumber = passenger.EBiletNo;
    this.fuelCharge = passenger.YakitHarc;
    this.airportTax = passenger.AlanVergi;
    this.isThyCip = passenger.ThyCipVarMi;
    this.isCitizen = passenger.TCVatandasiMi;
    this.ticketCancellationFee = passenger.BiletIptalHizmetiUcret;
    this.seatNumber = passenger.KoltukNo;
    this.boardingLocation = passenger.BinisYer;
    this.boardingService = passenger.BinisServis;
    this.arrivalService = passenger.InisServis;
    this.transactionType = passenger.IslemTipi;
    this.transactionDate = passenger.IslemTarihi;
    this.agency = passenger.Acente;
    this.user = passenger.Kullanici;
    this.agencyId = passenger.AcenteID;
    this.userId = passenger.KullaniciID;
    this.cmAgencyId = passenger.CM_AcenteID;
    this.cmUserId = passenger.CM_KullaniciID;
    this.centralAgencyId = passenger.MerkezAcenteID;
    this.transactionCurrencyRate = passenger.IslemDovizKur;
    this.currencyRateId = passenger.DovizKurId;
    this.isReissue = passenger.ReissueMu;
    this.isExtraService = passenger.EkHizmetMi;
    this.extraServiceId = passenger.EkHizmetId;
    this.status1 = passenger.Durum1;
    this.status1Date = passenger.Durum1Tarih;
    this.activeStatus = passenger.AktifDurum;
  }
}

export class SegmentBusDto {
  id: string;
  pnrId: string;
  departure: string;
  arrival: string;
  tripNumber: string;
  routeNumber: string;
  departureDate: string;
  arrivalDate: string;
  carrier: string;
  vehicleType: string;
  classType: string;
  tripDuration: string;
  tripType: string;
  platformNumber: string;
  departureTerminal: string;
  emptyDate: string;
  emptyHour: string;
  tripTrackingNumber: string;
  isReturn: string;
  departureCode: string;
  arrivalCode: string;
  departurePointId: string;
  arrivalPointId: string;
  showRoadSearchPoints: string;
  travelDurationDisplayType: string;
  classCategory: string;
  companyName: string;
  companyCode: string;
  companyId: string;
  companyNumber: string;
  isTicketCancellable: string;
  isTicketOpenable: string;
  travelType: string;
  tripDurationMinutes: string;
  approximateTravelDuration: string;
  departureRoadPointId: string;
  departureRoadPoint: string;
  arrivalRoadPointId: string;
  arrivalRoadPoint: string;
  cancellationTimeUntilDepartureMinutes: string;

  constructor(segment: SegmentBus) {
    this.id = segment.ID;
    this.pnrId = segment.PNRID;
    this.departure = segment.Kalkis;
    this.arrival = segment.Varis;
    this.tripNumber = segment.SeferNo;
    this.routeNumber = segment.HatNo;
    this.departureDate = segment.KalkisTarih;
    this.arrivalDate = segment.VarisTarih;
    this.carrier = segment.TasiyiciFirma;
    this.vehicleType = segment.AracTipi;
    this.classType = segment.Sinif;
    this.tripDuration = segment.SeferSure;
    this.tripType = segment.SeferTip;
    this.platformNumber = segment.PeronNo;
    this.departureTerminal = segment.KalkisTerminal;
    this.emptyDate = segment.BosTarih;
    this.emptyHour = segment.BosSaat;
    this.tripTrackingNumber = segment.SeferTakipNo;
    this.isReturn = segment.DonusMu;
    this.departureCode = segment.KalkisKod.KalkisKod;
    this.arrivalCode = segment.VarisKod.VarisKod;
    this.departurePointId = segment.KalkisNoktaID;
    this.arrivalPointId = segment.VarisNoktaID;
    this.showRoadSearchPoints = segment.CiktilardaKaraAramaNoktalariGozuksunMu;
    this.travelDurationDisplayType = segment.SeyahatSuresiGosterimTipi;
    this.classCategory = segment.SinifTip;
    this.companyName = segment.FirmaAd;
    this.companyCode = segment.FirmaKod;
    this.companyId = segment.FirmaID;
    this.companyNumber = segment.FirmaNo;
    this.isTicketCancellable = segment.BiletIptalAktifMi;
    this.isTicketOpenable = segment.BiletAcigaAlAktifMi;
    this.travelType = segment.SeyahatTipi;
    this.tripDurationMinutes = segment.SeferSureDk;
    this.approximateTravelDuration = segment.YaklasikSeyahatSuresi;
    this.departureRoadPointId = segment.KalkisKaraNoktaID;
    this.departureRoadPoint = segment.KalkisKaraNokta;
    this.arrivalRoadPointId = segment.VarisKaraNoktaID;
    this.arrivalRoadPoint = segment.VarisKaraNokta;
    this.cancellationTimeUntilDepartureMinutes =
      segment.SefereKadarIptalEdilebilmeSuresiDakika;
  }
}

export class OpenTicketBusDto {
  collection: string;
  spentAmount: string;
  openAmount: string;
  earnedPoints: string;
  spentPoints: string;
  netPoints: string;
  trackingNumber: string;

  constructor(openTicket: OpenTicketBus) {
    this.collection = openTicket.Tahsilat;
    this.spentAmount = openTicket.HarcananTutar;
    this.openAmount = openTicket.AcikTutar;
    this.earnedPoints = openTicket.KazanilanPuan;
    this.spentPoints = openTicket.HarcananPuan;
    this.netPoints = openTicket.NetPuan;
    this.trackingNumber = openTicket.TakipNo;
  }
}

export class MembershipBusDto {
  milparaCardNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  identityNumber: string;
  gender: string;

  constructor(membership: MembershipBus) {
    this.milparaCardNumber = membership.MilparaKartNo;
    this.firstName = membership.Ad;
    this.lastName = membership.Soyad;
    this.email = membership.Email;
    this.mobilePhone = membership.CepTel;
    this.identityNumber = membership.TcKimlikNo;
    this.gender = membership.Cinsiyet;
  }
}

export class CollectionBusDto {
  date: string;
  agency: string;
  transactionType: string;
  type: string;
  amount: string;

  constructor(collection: CollectionBus) {
    this.date = collection.Tarih;
    this.agency = collection.Acente;
    this.transactionType = collection.IslemTip;
    this.type = collection.Tip;
    this.amount = collection.Tutar;
  }
}

export class PnrTransactionDetailBusDto {
  pnr: string;
  transactionType: string;
  date: string;
  company: string;
  departureArrival: string;
  seatNumber: string;
  fullName: string;
  amount: string;

  constructor(pnrTransactionDetail: PnrTransactionDetailBus) {
    this.pnr = pnrTransactionDetail.PNR;
    this.transactionType = pnrTransactionDetail.IslemTipi;
    this.date = pnrTransactionDetail.Tarih;
    this.company = pnrTransactionDetail.Firma;
    this.departureArrival = pnrTransactionDetail.KalkisVaris;
    this.seatNumber = pnrTransactionDetail.KoltukNo;
    this.fullName = pnrTransactionDetail.AdSoyad;
    this.amount = pnrTransactionDetail.Tutar;
  }
}

export class InvoiceBusDto {
  id: string;
  pnrId: string;
  invoiceType: string;

  constructor(invoice: InvoiceBus) {
    this.id = invoice.ID;
    this.pnrId = invoice.PNRID;
    this.invoiceType = invoice.FaturaTip;
  }
}

export class CommissionBusDto {
  agency: string;
  amount: string;
  rate: string;

  constructor(commission: CommissionBus) {
    this.agency = commission.Acente;
    this.amount = commission.Tutar;
    this.rate = commission.Oran;
  }
}
export class SeatNumbersBusDto {
  seatNumber: string;
  pnrSegmentId: string;
  pnrPassengerId: string;

  constructor(seatNumbers: SeatNumbersBus) {
    this.seatNumber = seatNumbers.KoltukNo;
    this.pnrSegmentId = seatNumbers.PNRSegmentID;
    this.pnrPassengerId = seatNumbers.PNRYolcuID;
  }
}

export class AgencyPrepaymentBusDto {
  installmentCount: string;
  maturityDifference: string;
  amount: string;

  constructor(agencyPrepayment: AgencyPrepaymentBus) {
    this.installmentCount = agencyPrepayment.TaksitSayi;
    this.maturityDifference = agencyPrepayment.VadeFark;
    this.amount = agencyPrepayment.Tutar;
  }
}

export class PnrExtraServiceSegmentBusDto {
  id: string;
  pnrId: string;
  departure: string;
  arrival: string;
  flightNumber: string;
  lineNumber: string;
  departureDate: string;
  arrivalDate: string;
  carrierCompany: string;
  vehicleType: string;
  class: string;
  flightDuration: string;
  flightType: string;
  platformNumber: string;
  departureTerminal: string;
  emptyDate: string;
  emptyTime: string;
  flightTrackingNumber: string;
  returnTrip: string;
  departureCode: string;
  arrivalCode: string;
  departurePointId: string;
  arrivalPointId: string;
  showLandSearchPoints: string;
  travelTimeDisplayType: string;
  classType: string;
  companyName: string;
  companyCode: string;
  companyId: string;
  companyNumber: string;
  ticketCancellationActive: string;
  ticketOpenActive: string;

  constructor(extraSegment: PnrExtraServiceSegmentBus) {
    this.id = extraSegment.ID;
    this.pnrId = extraSegment.PNRID;
    this.departure = extraSegment.Kalkis;
    this.arrival = extraSegment.Varis;
    this.flightNumber = extraSegment.SeferNo;
    this.lineNumber = extraSegment.HatNo;
    this.departureDate = extraSegment.KalkisTarih;
    this.arrivalDate = extraSegment.VarisTarih;
    this.carrierCompany = extraSegment.TasiyiciFirma;
    this.vehicleType = extraSegment.AracTipi;
    this.class = extraSegment.Sinif;
    this.flightDuration = extraSegment.SeferSure;
    this.flightType = extraSegment.SeferTip;
    this.platformNumber = extraSegment.PeronNo;
    this.departureTerminal = extraSegment.KalkisTerminal;
    this.emptyDate = extraSegment.BosTarih;
    this.emptyTime = extraSegment.BosSaat;
    this.flightTrackingNumber = extraSegment.SeferTakipNo;
    this.returnTrip = extraSegment.DonusMu;
    this.departureCode = extraSegment.KalkisKod.KalkisKod;
    this.arrivalCode = extraSegment.VarisKod.VarisKod;
    this.departurePointId = extraSegment.KalkisNoktaID;
    this.arrivalPointId = extraSegment.VarisNoktaID;
    this.showLandSearchPoints =
      extraSegment.CiktilardaKaraAramaNoktalariGozuksunMu;
    this.travelTimeDisplayType = extraSegment.SeyahatSuresiGosterimTipi;
    this.classType = extraSegment.SinifTip;
    this.companyName = extraSegment.FirmaAd;
    this.companyCode = extraSegment.FirmaKod;
    this.companyId = extraSegment.FirmaID;
    this.companyNumber = extraSegment.FirmaNo;
    this.ticketCancellationActive = extraSegment.BiletIptalAktifMi;
    this.ticketOpenActive = extraSegment.BiletAcigaAlAktifMi;
  }
}

export class PnrSearchBusDto {
  constructor(
    public pnr: PnrBusDto,
    public passenger: PassengerBusDto,
    public segment: SegmentBusDto,
    public openTicket: OpenTicketBusDto,
    public membership: MembershipBusDto,
    public collection: CollectionBusDto,
    public pnrTransactionDetail: PnrTransactionDetailBusDto,
    public invoice: InvoiceBusDto,
    public commission: CommissionBusDto,
    public seatNumbers: SeatNumbersBusDto,
    public agencyPrepayment: AgencyPrepaymentBusDto,
    public pnrExtraServiceSegment: PnrExtraServiceSegmentBusDto,
  ) {}
}
