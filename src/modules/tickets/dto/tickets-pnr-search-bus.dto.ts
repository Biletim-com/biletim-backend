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
    this.id = pnr.ID[0];
    this.pnr = pnr.PNR[0];
    this.pnrType = pnr.PnrTip[0];
    this.trackingNumber = pnr.TakipNo[0];
    this.name = pnr.Ad[0];
    this.surname = pnr.Soyad[0];
    this.phone = pnr.Tel[0];
    this.email = pnr.Email[0];
    this.identificationNumber = pnr.TCKimlikNo[0];
    this.reminderNote = pnr.HatirlaticiNot[0];
    this.smsSentCount = pnr.SMSGonderimSayi[0];
    this.isInvoiced = pnr.FaturalansinMi[0];
    this.isOffline = pnr.OfflineMi[0];
    this.memberId = pnr.UyeID[0];
    this.isIndividualInvoice = pnr.CM_EFaturaBireyselMi[0];
    this.dataPrivacyAgreementId = pnr.AydinlatmaSozlesmeID[0];
    this.explicitConsentAgreementId = pnr.AcikRizaSozlesmeID[0];
    this.serviceAgreementId = pnr.HizmetSozlesmeID[0];
    this.countryPhoneCode = pnr.UlkeTelefonKodu[0];
    this.isByBiletallApi = pnr.ByBiletallApi[0];
    this.companyNumber = pnr.FirmaNo[0];
    this.totalDiscount = pnr.ToplamIndirim[0];
    this.serviceFeeDiscount = pnr.ServisUcretIndirim[0];
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
    this.pnr = passenger.PNR[0];
    this.id = passenger.ID[0];
    this.pnrId = passenger.PNRID[0];
    this.name = passenger.Ad[0];
    this.surname = passenger.Soyad[0];
    this.identificationNumber = passenger.TCKimlikNo[0];
    this.gender = passenger.Cinsiyet[0];
    this.type = passenger.Tip[0];
    this.price = passenger.Fiyat[0];
    this.serviceFee = passenger.ServisUcret[0];
    this.tax = passenger.Vergi[0];
    this.eTicketNumber = passenger.EBiletNo[0];
    this.fuelCharge = passenger.YakitHarc[0];
    this.airportTax = passenger.AlanVergi[0];
    this.isThyCip = passenger.ThyCipVarMi[0];
    this.isCitizen = passenger.TCVatandasiMi[0];
    this.ticketCancellationFee = passenger.BiletIptalHizmetiUcret[0];
    this.seatNumber = passenger.KoltukNo[0];
    this.boardingLocation = passenger.BinisYer[0];
    this.boardingService = passenger.BinisServis[0];
    this.arrivalService = passenger.InisServis[0];
    this.transactionType = passenger.IslemTipi[0];
    this.transactionDate = passenger.IslemTarihi[0];
    this.agency = passenger.Acente[0];
    this.user = passenger.Kullanici[0];
    this.agencyId = passenger.AcenteID[0];
    this.userId = passenger.KullaniciID[0];
    this.cmAgencyId = passenger.CM_AcenteID[0];
    this.cmUserId = passenger.CM_KullaniciID[0];
    this.centralAgencyId = passenger.MerkezAcenteID[0];
    this.transactionCurrencyRate = passenger.IslemDovizKur[0];
    this.currencyRateId = passenger.DovizKurId[0];
    this.isReissue = passenger.ReissueMu[0];
    this.isExtraService = passenger.EkHizmetMi[0];
    this.extraServiceId = passenger.EkHizmetId[0];
    this.status1 = passenger.Durum1[0];
    this.status1Date = passenger.Durum1Tarih[0];
    this.activeStatus = passenger.AktifDurum[0];
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
    this.id = segment.ID[0];
    this.pnrId = segment.PNRID[0];
    this.departure = segment.Kalkis[0];
    this.arrival = segment.Varis[0];
    this.tripNumber = segment.SeferNo[0];
    this.routeNumber = segment.HatNo[0];
    this.departureDate = segment.KalkisTarih[0];
    this.arrivalDate = segment.VarisTarih[0];
    this.carrier = segment.TasiyiciFirma[0];
    this.vehicleType = segment.AracTipi[0];
    this.classType = segment.Sinif[0];
    this.tripDuration = segment.SeferSure[0];
    this.tripType = segment.SeferTip[0];
    this.platformNumber = segment.PeronNo[0];
    this.departureTerminal = segment.KalkisTerminal[0];
    this.emptyDate = segment.BosTarih[0];
    this.emptyHour = segment.BosSaat[0];
    this.tripTrackingNumber = segment.SeferTakipNo[0];
    this.isReturn = segment.DonusMu[0];
    this.departureCode = segment.KalkisKod.KalkisKod[0];
    this.arrivalCode = segment.VarisKod.VarisKod[0];
    this.departurePointId = segment.KalkisNoktaID[0];
    this.arrivalPointId = segment.VarisNoktaID[0];
    this.showRoadSearchPoints =
      segment.CiktilardaKaraAramaNoktalariGozuksunMu[0];
    this.travelDurationDisplayType = segment.SeyahatSuresiGosterimTipi[0];
    this.classCategory = segment.SinifTip[0];
    this.companyName = segment.FirmaAd[0];
    this.companyCode = segment.FirmaKod[0];
    this.companyId = segment.FirmaID[0];
    this.companyNumber = segment.FirmaNo[0];
    this.isTicketCancellable = segment.BiletIptalAktifMi[0];
    this.isTicketOpenable = segment.BiletAcigaAlAktifMi[0];
    this.travelType = segment.SeyahatTipi[0];
    this.tripDurationMinutes = segment.SeferSureDk[0];
    this.approximateTravelDuration = segment.YaklasikSeyahatSuresi[0];
    this.departureRoadPointId = segment.KalkisKaraNoktaID[0];
    this.departureRoadPoint = segment.KalkisKaraNokta[0];
    this.arrivalRoadPointId = segment.VarisKaraNoktaID[0];
    this.arrivalRoadPoint = segment.VarisKaraNokta[0];
    this.cancellationTimeUntilDepartureMinutes =
      segment.SefereKadarIptalEdilebilmeSuresiDakika[0];
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
    this.collection = openTicket.Tahsilat[0];
    this.spentAmount = openTicket.HarcananTutar[0];
    this.openAmount = openTicket.AcikTutar[0];
    this.earnedPoints = openTicket.KazanilanPuan[0];
    this.spentPoints = openTicket.HarcananPuan[0];
    this.netPoints = openTicket.NetPuan[0];
    this.trackingNumber = openTicket.TakipNo[0];
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
    this.milparaCardNumber = membership.MilparaKartNo[0];
    this.firstName = membership.Ad[0];
    this.lastName = membership.Soyad[0];
    this.email = membership.Email[0];
    this.mobilePhone = membership.CepTel[0];
    this.identityNumber = membership.TcKimlikNo[0];
    this.gender = membership.Cinsiyet[0];
  }
}

export class CollectionBusDto {
  date: string;
  agency: string;
  transactionType: string;
  type: string;
  amount: string;

  constructor(collection: CollectionBus) {
    this.date = collection.Tarih[0];
    this.agency = collection.Acente[0];
    this.transactionType = collection.IslemTip[0];
    this.type = collection.Tip[0];
    this.amount = collection.Tutar[0];
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
    this.pnr = pnrTransactionDetail.PNR[0];
    this.transactionType = pnrTransactionDetail.IslemTipi[0];
    this.date = pnrTransactionDetail.Tarih[0];
    this.company = pnrTransactionDetail.Firma[0];
    this.departureArrival = pnrTransactionDetail.KalkisVaris[0];
    this.seatNumber = pnrTransactionDetail.KoltukNo[0];
    this.fullName = pnrTransactionDetail.AdSoyad[0];
    this.amount = pnrTransactionDetail.Tutar[0];
  }
}

export class InvoiceBusDto {
  id: string;
  pnrId: string;
  invoiceType: string;

  constructor(invoice: InvoiceBus) {
    this.id = invoice.ID[0];
    this.pnrId = invoice.PNRID[0];
    this.invoiceType = invoice.FaturaTip[0];
  }
}

export class CommissionBusDto {
  agency: string;
  amount: string;
  rate: string;

  constructor(commission: CommissionBus) {
    this.agency = commission.Acente[0];
    this.amount = commission.Tutar[0];
    this.rate = commission.Oran[0];
  }
}
export class SeatNumbersBusDto {
  seatNumber: string;
  pnrSegmentId: string;
  pnrPassengerId: string;

  constructor(seatNumbers: SeatNumbersBus) {
    this.seatNumber = seatNumbers.KoltukNo[0];
    this.pnrSegmentId = seatNumbers.PNRSegmentID[0];
    this.pnrPassengerId = seatNumbers.PNRYolcuID[0];
  }
}

export class AgencyPrepaymentBusDto {
  installmentCount: string;
  maturityDifference: string;
  amount: string;

  constructor(agencyPrepayment: AgencyPrepaymentBus) {
    this.installmentCount = agencyPrepayment.TaksitSayi[0];
    this.maturityDifference = agencyPrepayment.VadeFark[0];
    this.amount = agencyPrepayment.Tutar[0];
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
    this.id = extraSegment.ID[0];
    this.pnrId = extraSegment.PNRID[0];
    this.departure = extraSegment.Kalkis[0];
    this.arrival = extraSegment.Varis[0];
    this.flightNumber = extraSegment.SeferNo[0];
    this.lineNumber = extraSegment.HatNo[0];
    this.departureDate = extraSegment.KalkisTarih[0];
    this.arrivalDate = extraSegment.VarisTarih[0];
    this.carrierCompany = extraSegment.TasiyiciFirma[0];
    this.vehicleType = extraSegment.AracTipi[0];
    this.class = extraSegment.Sinif[0];
    this.flightDuration = extraSegment.SeferSure[0];
    this.flightType = extraSegment.SeferTip[0];
    this.platformNumber = extraSegment.PeronNo[0];
    this.departureTerminal = extraSegment.KalkisTerminal[0];
    this.emptyDate = extraSegment.BosTarih[0];
    this.emptyTime = extraSegment.BosSaat[0];
    this.flightTrackingNumber = extraSegment.SeferTakipNo[0];
    this.returnTrip = extraSegment.DonusMu[0];
    this.departureCode = extraSegment.KalkisKod.KalkisKod[0];
    this.arrivalCode = extraSegment.VarisKod.VarisKod[0];
    this.departurePointId = extraSegment.KalkisNoktaID[0];
    this.arrivalPointId = extraSegment.VarisNoktaID[0];
    this.showLandSearchPoints =
      extraSegment.CiktilardaKaraAramaNoktalariGozuksunMu[0];
    this.travelTimeDisplayType = extraSegment.SeyahatSuresiGosterimTipi[0];
    this.classType = extraSegment.SinifTip[0];
    this.companyName = extraSegment.FirmaAd[0];
    this.companyCode = extraSegment.FirmaKod[0];
    this.companyId = extraSegment.FirmaID[0];
    this.companyNumber = extraSegment.FirmaNo[0];
    this.ticketCancellationActive = extraSegment.BiletIptalAktifMi[0];
    this.ticketOpenActive = extraSegment.BiletAcigaAlAktifMi[0];
  }
}

export class PnrSearchBusDto {
  constructor(
    public pnr: PnrBusDto[],
    public passenger: PassengerBusDto[],
    public segment: SegmentBusDto[],
    public openTicket: OpenTicketBusDto[],
    public membership: MembershipBusDto[],
    public collection: CollectionBusDto[],
    public pnrTransactionDetail: PnrTransactionDetailBusDto[],
    public invoice: InvoiceBusDto[],
    public commission: CommissionBusDto[],
    public seatNumbers: SeatNumbersBusDto[],
    public agencyPrepayment: AgencyPrepaymentBusDto[],
    public pnrExtraServiceSegment: PnrExtraServiceSegmentBusDto[],
  ) {}
}
