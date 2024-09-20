import {
  InvoiceAbroadFlight,
  MembershipAbroadFlight,
  OpenTicketAbroadFlight,
  PassengerAbroadFlight,
  PaymentRulesAbroadFlight,
  PnrAbroadFlight,
  PnrExtraServiceSegmentAbroadFlight,
  SeatNumbersAbroadFlight,
  SegmentAbroadFlight,
} from '../type/tickets-pnr-search-abroad-flight-response.type';

export class PnrAbroadFlightDto {
  id: string;
  pnr: string;
  pnrType: string;
  trackingNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  nationalId: string;
  reminderNote: string;
  smsSentCount: string;
  isInvoiceRequested: string;
  baggageInfo: string;
  isOffline: string;
  memberId: string;
  isEInvoiceIndividual: string;
  galileoUrlLocCode: string;
  galileoTFPnr: string;
  lightingContractId: string;
  explicitConsentContractId: string;
  serviceContractId: string;
  countryPhoneCode: string;
  byBiletallApi: string;
  companyNumber: string;
  totalDiscount: string;
  serviceFeeDiscount: string;

  constructor(pnr: PnrAbroadFlight) {
    this.id = pnr.ID[0];
    this.pnr = pnr.PNR[0];
    this.pnrType = pnr.PnrTip[0];
    this.trackingNumber = pnr.TakipNo[0];
    this.firstName = pnr.Ad[0];
    this.lastName = pnr.Soyad[0];
    this.phoneNumber = pnr.Tel[0];
    this.email = pnr.Email[0];
    this.nationalId = pnr.TCKimlikNo[0];
    this.reminderNote = pnr.HatirlaticiNot[0];
    this.smsSentCount = pnr.SMSGonderimSayi[0];
    this.isInvoiceRequested = pnr.FaturalansinMi[0];
    this.baggageInfo = pnr.BagajBilgileri[0];
    this.isOffline = pnr.OfflineMi[0];
    this.memberId = pnr.UyeID[0];
    this.isEInvoiceIndividual = pnr.CM_EFaturaBireyselMi[0];
    this.galileoUrlLocCode = pnr.GalileoURLocKod[0];
    this.galileoTFPnr = pnr.GalileoTFPNR[0];
    this.lightingContractId = pnr.AydinlatmaSozlesmeID[0];
    this.explicitConsentContractId = pnr.AcikRizaSozlesmeID[0];
    this.serviceContractId = pnr.HizmetSozlesmeID[0];
    this.countryPhoneCode = pnr.UlkeTelefonKodu[0];
    this.byBiletallApi = pnr.ByBiletallApi[0];
    this.companyNumber = pnr.FirmaNo[0];
    this.totalDiscount = pnr.ToplamIndirim[0];
    this.serviceFeeDiscount = pnr.ServisUcretIndirim[0];
  }
}

export class PassengerAbroadFlightDto {
  pnr: string;
  id: string;
  pnrId: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  gender: string;
  birthDate: string;
  type: string;
  price: string;
  serviceFee: string;
  tax: string;
  fuelCharge: string;
  airportTax: string;
  isThyCip: string;
  isCitizen: string;
  ticketCancellationServiceFee: string;
  seatNumber: string;
  transactionType: string;
  transactionDate: string;
  agency: string;
  user: string;
  agencyId: string;
  userId: string;
  centralAgencyId: string;
  transactionCurrencyRate: string;
  currencyRateId: string;
  isReissue: string;
  isAdditionalService: string;
  additionalServiceId: string;
  status1: string;
  status1Date: string;
  activeStatus: string;

  constructor(passenger: PassengerAbroadFlight) {
    this.pnr = passenger.PNR[0];
    this.id = passenger.ID[0];
    this.pnrId = passenger.PNRID[0];
    this.firstName = passenger.Ad[0];
    this.lastName = passenger.Soyad[0];
    this.nationalId = passenger.TCKimlikNo[0];
    this.gender = passenger.Cinsiyet[0];
    this.birthDate = passenger.DogumTarih[0];
    this.type = passenger.Tip[0];
    this.price = passenger.Fiyat[0];
    this.serviceFee = passenger.ServisUcret[0];
    this.tax = passenger.Vergi[0];
    this.fuelCharge = passenger.YakitHarc[0];
    this.airportTax = passenger.AlanVergi[0];
    this.isThyCip = passenger.ThyCipVarMi[0];
    this.isCitizen = passenger.TCVatandasiMi[0];
    this.ticketCancellationServiceFee = passenger.BiletIptalHizmetiUcret[0];
    this.seatNumber = passenger.KoltukNo[0];
    this.transactionType = passenger.IslemTipi[0];
    this.transactionDate = passenger.IslemTarihi[0];
    this.agency = passenger.Acente[0];
    this.user = passenger.Kullanici[0];
    this.agencyId = passenger.AcenteID[0];
    this.userId = passenger.KullaniciID[0];
    this.centralAgencyId = passenger.MerkezAcenteID[0];
    this.transactionCurrencyRate = passenger.IslemDovizKur[0];
    this.currencyRateId = passenger.DovizKurId[0];
    this.isReissue = passenger.ReissueMu[0];
    this.isAdditionalService = passenger.EkHizmetMi[0];
    this.additionalServiceId = passenger.EkHizmetId[0];
    this.status1 = passenger.Durum1[0];
    this.status1Date = passenger.Durum1Tarih[0];
    this.activeStatus = passenger.AktifDurum[0];
  }
}

export class SegmentAbroadFlightDto {
  id: string;
  pnrId: string;
  departure: string;
  arrival: string;
  flightNumber: string;
  departureDate: string;
  arrivalDate: string;
  carrier: string;
  vehicleType: string;
  class: string;
  cabin: string;
  flightDuration: string;
  isReturn: string;
  departureCode: string;
  arrivalCode: string;
  departurePointId: string;
  arrivalPointId: string;
  aircraftTypeId: string;
  classType: string;
  companyName: string;
  companyCode: string;
  companyId: string;
  companyNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  isTicketCancellable: string;
  isTicketOpenable: string;
  travelType: string;
  companyFlightNumber: string;
  className: string;
  aircraftType: string;
  corridorCount: string;
  deckCount: string;
  seatDistance: string;
  isMealPaid: string;
  flightDurationMinutes: string;
  cancellationTimeLimit: string;

  constructor(segment: SegmentAbroadFlight) {
    this.id = segment.ID[0];
    this.pnrId = segment.PNRID[0];
    this.departure = segment.Kalkis[0];
    this.arrival = segment.Varis[0];
    this.flightNumber = segment.SeferNo[0];
    this.departureDate = segment.KalkisTarih[0];
    this.arrivalDate = segment.VarisTarih[0];
    this.carrier = segment.TasiyiciFirma[0];
    this.vehicleType = segment.AracTipi[0];
    this.class = segment.Sinif[0];
    this.cabin = segment.Kabin[0];
    this.flightDuration = segment.SeferSure[0];
    this.isReturn = segment.DonusMu[0];
    this.departureCode = segment.KalkisKod[0];
    this.arrivalCode = segment.VarisKod[0];
    this.departurePointId = segment.KalkisNoktaID[0];
    this.arrivalPointId = segment.VarisNoktaID[0];
    this.aircraftTypeId = segment.UcakTipID[0];
    this.classType = segment.SinifTip[0];
    this.companyName = segment.FirmaAd[0];
    this.companyCode = segment.FirmaKod[0];
    this.companyId = segment.FirmaID[0];
    this.companyNumber = segment.FirmaNo[0];
    this.departureAirport = segment.KalkisHavaalan[0];
    this.arrivalAirport = segment.VarisHavaalan[0];
    this.isTicketCancellable = segment.BiletIptalAktifMi[0];
    this.isTicketOpenable = segment.BiletAcigaAlAktifMi[0];
    this.travelType = segment.SeyahatTipi[0];
    this.companyFlightNumber = segment.FirmaSeferNo[0];
    this.className = segment.SinifAd[0];
    this.aircraftType = segment.UcakTip[0];
    this.corridorCount = segment.KoridorSayi[0];
    this.deckCount = segment.KatSayi[0];
    this.seatDistance = segment.KoltukMesafe[0];
    this.isMealPaid = segment.YemekUcretliMi[0];
    this.flightDurationMinutes = segment.SeferSureDk[0];
    this.cancellationTimeLimit =
      segment.SefereKadarIptalEdilebilmeSuresiDakika[0];
  }
}

export class OpenTicketAbroadFlightDto {
  payment: string;
  spentAmount: string;
  openAmount: string;
  earnedPoints: string;
  spentPoints: string;
  netPoints: string;
  trackingNumber: string;

  constructor(ticket: OpenTicketAbroadFlight) {
    this.payment = ticket.Tahsilat[0];
    this.spentAmount = ticket.HarcananTutar[0];
    this.openAmount = ticket.AcikTutar[0];
    this.earnedPoints = ticket.KazanilanPuan[0];
    this.spentPoints = ticket.HarcananPuan[0];
    this.netPoints = ticket.NetPuan[0];
    this.trackingNumber = ticket.TakipNo[0];
  }
}

export class MembershipAbroadFlightDto {
  cardNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  nationalId: string;
  gender: string;

  constructor(membership: MembershipAbroadFlight) {
    this.cardNumber = membership.MilparaKartNo[0];
    this.firstName = membership.Ad[0];
    this.lastName = membership.Soyad[0];
    this.email = membership.Email[0];
    this.mobilePhone = membership.CepTel[0];
    this.nationalId = membership.TcKimlikNo[0];
    this.gender = membership.Cinsiyet[0];
  }
}

export class InvoiceAbroadFlightDto {
  id: string;
  pnrId: string;
  invoiceType: string;

  constructor(invoice: InvoiceAbroadFlight) {
    this.id = invoice.ID[0];
    this.pnrId = invoice.PNRID[0];
    this.invoiceType = invoice.FaturaTip[0];
  }
}

export class SeatNumbersAbroadFlightDto {
  seatNumber: string;
  pnrSegmentId: string;
  pnrPassengerId: string;
  baggageUnit: string;
  baggageCount: string;
  personalBaggage: string;
  cabinBaggage: string;
  baggageInfo: string;

  constructor(seatNumbers: SeatNumbersAbroadFlight) {
    this.seatNumber = seatNumbers.KoltukNo[0];
    this.pnrSegmentId = seatNumbers.PNRSegmentID[0];
    this.pnrPassengerId = seatNumbers.PNRYolcuID[0];
    this.baggageUnit = seatNumbers.BagajBirim[0];
    this.baggageCount = seatNumbers.BagajAdet[0];
    this.personalBaggage = seatNumbers.KisiselBagaj[0];
    this.cabinBaggage = seatNumbers.KabinBagaj[0];
    this.baggageInfo = seatNumbers.BagajBilgi[0];
  }
}

export class PnrExtraServiceSegmentAbroadFlightDto {
  id: string;
  pnrId: string;
  departure: string;
  arrival: string;
  flightNumber: string;
  departureDate: string;
  arrivalDate: string;
  carrier: string;
  vehicleType: string;
  class: string;
  cabin: string;
  flightDuration: string;
  isReturn: string;
  departureCode: string;
  arrivalCode: string;
  departurePointId: string;
  arrivalPointId: string;
  aircraftTypeId: string;
  classType: string;
  companyName: string;
  companyCode: string;
  companyId: string;
  companyNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  isTicketCancellable: string;
  isTicketOpenable: string;

  constructor(segment: PnrExtraServiceSegmentAbroadFlight) {
    this.id = segment.ID[0];
    this.pnrId = segment.PNRID[0];
    this.departure = segment.Kalkis[0];
    this.arrival = segment.Varis[0];
    this.flightNumber = segment.SeferNo[0];
    this.departureDate = segment.KalkisTarih[0];
    this.arrivalDate = segment.VarisTarih[0];
    this.carrier = segment.TasiyiciFirma[0];
    this.vehicleType = segment.AracTipi[0];
    this.class = segment.Sinif[0];
    this.cabin = segment.Kabin[0];
    this.flightDuration = segment.SeferSure[0];
    this.isReturn = segment.DonusMu[0];
    this.departureCode = segment.KalkisKod[0];
    this.arrivalCode = segment.VarisKod[0];
    this.departurePointId = segment.KalkisNoktaID[0];
    this.arrivalPointId = segment.VarisNoktaID[0];
    this.aircraftTypeId = segment.UcakTipID[0];
    this.classType = segment.SinifTip[0];
    this.companyName = segment.FirmaAd[0];
    this.companyCode = segment.FirmaKod[0];
    this.companyId = segment.FirmaID[0];
    this.companyNumber = segment.FirmaNo[0];
    this.departureAirport = segment.KalkisHavaalan[0];
    this.arrivalAirport = segment.VarisHavaalan[0];
    this.isTicketCancellable = segment.BiletIptalAktifMi[0];
    this.isTicketOpenable = segment.BiletAcigaAlAktifMi[0];
  }
}

export class PaymentRulesAbroadFlightDto {
  is3DSecurePaymentActive: string;
  is3DSecurePaymentMandatory: string;
  isOpenMoneyPaymentActive: string;
  isPrepaymentActive: string;
  isParakodPaymentActive: string;
  isBkmPaymentActive: string;
  isPaypalPaymentActive: string;
  paypalUpperLimit: string;
  isHopiActive: string;
  isMasterpassActive: string;
  isFastPayPaymentActive: string;
  isGarantiPayActive: string;

  constructor(paymentRules: PaymentRulesAbroadFlight) {
    this.is3DSecurePaymentActive = paymentRules.Odeme3DSecureAktifMi[0];
    this.is3DSecurePaymentMandatory = paymentRules.Odeme3DSecureZorunluMu[0];
    this.isOpenMoneyPaymentActive = paymentRules.AcikParaliOdemeAktifMi[0];
    this.isPrepaymentActive = paymentRules.OnOdemeAktifMi[0];
    this.isParakodPaymentActive = paymentRules.ParakodOdemeAktifMi[0];
    this.isBkmPaymentActive = paymentRules.BkmOdemeAktifMi[0];
    this.isPaypalPaymentActive = paymentRules.PaypalOdemeAktifMi[0];
    this.paypalUpperLimit = paymentRules.PaypalUstLimit[0];
    this.isHopiActive = paymentRules.HopiAktifMi[0];
    this.isMasterpassActive = paymentRules.MasterpassAktifMi[0];
    this.isFastPayPaymentActive = paymentRules.FastPayOdemeAktifMi[0];
    this.isGarantiPayActive = paymentRules.GarantiPayOdemeAktifMi[0];
  }
}

export class PnrSearchAbroadFlightDto {
  constructor(
    public pnr: PnrAbroadFlightDto[],
    public passenger: PassengerAbroadFlightDto[],
    public segment: SegmentAbroadFlightDto[],
    public openTicket: OpenTicketAbroadFlightDto[],
    public membership: MembershipAbroadFlightDto[],
    public invoice: InvoiceAbroadFlightDto[],
    public seatNumbers: SeatNumbersAbroadFlightDto[],
    public pnrExtraServiceSegment: PnrExtraServiceSegmentAbroadFlightDto[],
    public paymentRules: PaymentRulesAbroadFlightDto[],
  ) {}
}
