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
    this.id = pnr.ID;
    this.pnr = pnr.PNR;
    this.pnrType = pnr.PnrTip;
    this.trackingNumber = pnr.TakipNo;
    this.firstName = pnr.Ad;
    this.lastName = pnr.Soyad;
    this.phoneNumber = pnr.Tel;
    this.email = pnr.Email;
    this.nationalId = pnr.TCKimlikNo;
    this.reminderNote = pnr.HatirlaticiNot;
    this.smsSentCount = pnr.SMSGonderimSayi;
    this.isInvoiceRequested = pnr.FaturalansinMi;
    this.baggageInfo = pnr.BagajBilgileri;
    this.isOffline = pnr.OfflineMi;
    this.memberId = pnr.UyeID;
    this.isEInvoiceIndividual = pnr.CM_EFaturaBireyselMi;
    this.galileoUrlLocCode = pnr.GalileoURLocKod;
    this.galileoTFPnr = pnr.GalileoTFPNR;
    this.lightingContractId = pnr.AydinlatmaSozlesmeID;
    this.explicitConsentContractId = pnr.AcikRizaSozlesmeID;
    this.serviceContractId = pnr.HizmetSozlesmeID;
    this.countryPhoneCode = pnr.UlkeTelefonKodu;
    this.byBiletallApi = pnr.ByBiletallApi;
    this.companyNumber = pnr.FirmaNo;
    this.totalDiscount = pnr.ToplamIndirim;
    this.serviceFeeDiscount = pnr.ServisUcretIndirim;
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
    this.pnr = passenger.PNR;
    this.id = passenger.ID;
    this.pnrId = passenger.PNRID;
    this.firstName = passenger.Ad;
    this.lastName = passenger.Soyad;
    this.nationalId = passenger.TCKimlikNo;
    this.gender = passenger.Cinsiyet;
    this.birthDate = passenger.DogumTarih;
    this.type = passenger.Tip;
    this.price = passenger.Fiyat;
    this.serviceFee = passenger.ServisUcret;
    this.tax = passenger.Vergi;
    this.fuelCharge = passenger.YakitHarc;
    this.airportTax = passenger.AlanVergi;
    this.isThyCip = passenger.ThyCipVarMi;
    this.isCitizen = passenger.TCVatandasiMi;
    this.ticketCancellationServiceFee = passenger.BiletIptalHizmetiUcret;
    this.seatNumber = passenger.KoltukNo;
    this.transactionType = passenger.IslemTipi;
    this.transactionDate = passenger.IslemTarihi;
    this.agency = passenger.Acente;
    this.user = passenger.Kullanici;
    this.agencyId = passenger.AcenteID;
    this.userId = passenger.KullaniciID;
    this.centralAgencyId = passenger.MerkezAcenteID;
    this.transactionCurrencyRate = passenger.IslemDovizKur;
    this.currencyRateId = passenger.DovizKurId;
    this.isReissue = passenger.ReissueMu;
    this.isAdditionalService = passenger.EkHizmetMi;
    this.additionalServiceId = passenger.EkHizmetId;
    this.status1 = passenger.Durum1;
    this.status1Date = passenger.Durum1Tarih;
    this.activeStatus = passenger.AktifDurum;
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
    this.id = segment.ID;
    this.pnrId = segment.PNRID;
    this.departure = segment.Kalkis;
    this.arrival = segment.Varis;
    this.flightNumber = segment.SeferNo;
    this.departureDate = segment.KalkisTarih;
    this.arrivalDate = segment.VarisTarih;
    this.carrier = segment.TasiyiciFirma;
    this.vehicleType = segment.AracTipi;
    this.class = segment.Sinif;
    this.cabin = segment.Kabin;
    this.flightDuration = segment.SeferSure;
    this.isReturn = segment.DonusMu;
    this.departureCode = segment.KalkisKod;
    this.arrivalCode = segment.VarisKod;
    this.departurePointId = segment.KalkisNoktaID;
    this.arrivalPointId = segment.VarisNoktaID;
    this.aircraftTypeId = segment.UcakTipID;
    this.classType = segment.SinifTip;
    this.companyName = segment.FirmaAd;
    this.companyCode = segment.FirmaKod;
    this.companyId = segment.FirmaID;
    this.companyNumber = segment.FirmaNo;
    this.departureAirport = segment.KalkisHavaalan;
    this.arrivalAirport = segment.VarisHavaalan;
    this.isTicketCancellable = segment.BiletIptalAktifMi;
    this.isTicketOpenable = segment.BiletAcigaAlAktifMi;
    this.travelType = segment.SeyahatTipi;
    this.companyFlightNumber = segment.FirmaSeferNo;
    this.className = segment.SinifAd;
    this.aircraftType = segment.UcakTip;
    this.corridorCount = segment.KoridorSayi;
    this.deckCount = segment.KatSayi;
    this.seatDistance = segment.KoltukMesafe;
    this.isMealPaid = segment.YemekUcretliMi;
    this.flightDurationMinutes = segment.SeferSureDk;
    this.cancellationTimeLimit = segment.SefereKadarIptalEdilebilmeSuresiDakika;
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
    this.payment = ticket.Tahsilat;
    this.spentAmount = ticket.HarcananTutar;
    this.openAmount = ticket.AcikTutar;
    this.earnedPoints = ticket.KazanilanPuan;
    this.spentPoints = ticket.HarcananPuan;
    this.netPoints = ticket.NetPuan;
    this.trackingNumber = ticket.TakipNo;
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
    this.cardNumber = membership.MilparaKartNo;
    this.firstName = membership.Ad;
    this.lastName = membership.Soyad;
    this.email = membership.Email;
    this.mobilePhone = membership.CepTel;
    this.nationalId = membership.TcKimlikNo;
    this.gender = membership.Cinsiyet;
  }
}

export class InvoiceAbroadFlightDto {
  id: string;
  pnrId: string;
  invoiceType: string;

  constructor(invoice: InvoiceAbroadFlight) {
    this.id = invoice.ID;
    this.pnrId = invoice.PNRID;
    this.invoiceType = invoice.FaturaTip;
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
    this.seatNumber = seatNumbers.KoltukNo;
    this.pnrSegmentId = seatNumbers.PNRSegmentID;
    this.pnrPassengerId = seatNumbers.PNRYolcuID;
    this.baggageUnit = seatNumbers.BagajBirim;
    this.baggageCount = seatNumbers.BagajAdet;
    this.personalBaggage = seatNumbers.KisiselBagaj;
    this.cabinBaggage = seatNumbers.KabinBagaj;
    this.baggageInfo = seatNumbers.BagajBilgi;
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
    this.id = segment.ID;
    this.pnrId = segment.PNRID;
    this.departure = segment.Kalkis;
    this.arrival = segment.Varis;
    this.flightNumber = segment.SeferNo;
    this.departureDate = segment.KalkisTarih;
    this.arrivalDate = segment.VarisTarih;
    this.carrier = segment.TasiyiciFirma;
    this.vehicleType = segment.AracTipi;
    this.class = segment.Sinif;
    this.cabin = segment.Kabin;
    this.flightDuration = segment.SeferSure;
    this.isReturn = segment.DonusMu;
    this.departureCode = segment.KalkisKod;
    this.arrivalCode = segment.VarisKod;
    this.departurePointId = segment.KalkisNoktaID;
    this.arrivalPointId = segment.VarisNoktaID;
    this.aircraftTypeId = segment.UcakTipID;
    this.classType = segment.SinifTip;
    this.companyName = segment.FirmaAd;
    this.companyCode = segment.FirmaKod;
    this.companyId = segment.FirmaID;
    this.companyNumber = segment.FirmaNo;
    this.departureAirport = segment.KalkisHavaalan;
    this.arrivalAirport = segment.VarisHavaalan;
    this.isTicketCancellable = segment.BiletIptalAktifMi;
    this.isTicketOpenable = segment.BiletAcigaAlAktifMi;
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
    this.is3DSecurePaymentActive = paymentRules.Odeme3DSecureAktifMi;
    this.is3DSecurePaymentMandatory = paymentRules.Odeme3DSecureZorunluMu;
    this.isOpenMoneyPaymentActive = paymentRules.AcikParaliOdemeAktifMi;
    this.isPrepaymentActive = paymentRules.OnOdemeAktifMi;
    this.isParakodPaymentActive = paymentRules.ParakodOdemeAktifMi;
    this.isBkmPaymentActive = paymentRules.BkmOdemeAktifMi;
    this.isPaypalPaymentActive = paymentRules.PaypalOdemeAktifMi;
    this.paypalUpperLimit = paymentRules.PaypalUstLimit;
    this.isHopiActive = paymentRules.HopiAktifMi;
    this.isMasterpassActive = paymentRules.MasterpassAktifMi;
    this.isFastPayPaymentActive = paymentRules.FastPayOdemeAktifMi;
    this.isGarantiPayActive = paymentRules.GarantiPayOdemeAktifMi;
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
