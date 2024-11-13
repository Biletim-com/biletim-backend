import {
  AgencyPrepaymentDomesticFlight,
  CollectionDomesticFlight,
  CommissionDomesticFlight,
  InvoiceDomesticFlight,
  MembershipDomesticFlight,
  OpenTicketDomesticFlight,
  PassengerDomesticFlight,
  PnrDomesticFlight,
  PnrExtraServiceSegmentDomesticFlight,
  PnrTransactionDetailDomesticFlight,
  SeatNumbersDomesticFlight,
  SegmentDomesticFlight,
} from '../type/tickets-pnr-search-domestic-flight-response.type';

export class PnrDomesticFlightDto {
  id: string;
  pnr: string;
  pnrType: string;
  trackingNumber: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  identityNumber: string;
  smsSendingCount: string;
  landline: string;
  invoiceRequested: string;
  invoicePersonFirstName: string;
  invoicePersonLastName: string;
  invoicePersonIdentityNumber: string;
  invoicePersonAddress: string;
  isOffline: string;
  memberId: string;
  isIndividualEfatura: string;
  informationAgreementId: string;
  explicitConsentAgreementId: string;
  serviceAgreementId: string;
  countryPhoneCode: string;
  companyNumber: string;
  totalDiscount: string;
  serviceFeeDiscount: string;

  constructor(pnr: PnrDomesticFlight) {
    this.id = pnr.ID;
    this.pnr = pnr.PNR;
    this.pnrType = pnr.PnrTip;
    this.trackingNumber = pnr.TakipNo;
    this.firstName = pnr.Ad;
    this.lastName = pnr.Soyad;
    this.phone = pnr.Tel;
    this.email = pnr.Email;
    this.identityNumber = pnr.TCKimlikNo;
    this.smsSendingCount = pnr.SMSGonderimSayi;
    this.landline = pnr.SabitTel;
    this.invoiceRequested = pnr.FaturalansinMi;
    this.invoicePersonFirstName = pnr.FaturaKisiAd;
    this.invoicePersonLastName = pnr.FaturaKisiSoyad;
    this.invoicePersonIdentityNumber = pnr.FaturaKisiTCKNo;
    this.invoicePersonAddress = pnr.FaturaKisiAdres;
    this.isOffline = pnr.OfflineMi;
    this.memberId = pnr.UyeID;
    this.isIndividualEfatura = pnr.CM_EFaturaBireyselMi;
    this.informationAgreementId = pnr.AydinlatmaSozlesmeID;
    this.explicitConsentAgreementId = pnr.AcikRizaSozlesmeID;
    this.serviceAgreementId = pnr.HizmetSozlesmeID;
    this.countryPhoneCode = pnr.UlkeTelefonKodu;
    this.companyNumber = pnr.FirmaNo;
    this.totalDiscount = pnr.ToplamIndirim;
    this.serviceFeeDiscount = pnr.ServisUcretIndirim;
  }
}

export class PassengerDomesticFlightDto {
  pnr: string;
  id: string;
  pnrId: string;
  firstName: string;
  lastName: string;
  identityNumber: string;
  gender: string;
  birthDate: string;
  type: string;
  price: string;
  serviceFee: string;
  tax: string;
  eTicketNumber: string;
  fuelConsumption: string;
  collectedTax: string;
  hasThyCip: string;
  isTcvCitizen: string;
  ticketCancellationServiceFee: string;
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
  isAdditionalService: string;
  additionalServiceId: string;
  status1: string;
  status1Date: string;
  activeStatus: string;

  constructor(passenger: PassengerDomesticFlight) {
    this.pnr = passenger.PNR;
    this.id = passenger.ID;
    this.pnrId = passenger.PNRID;
    this.firstName = passenger.Ad;
    this.lastName = passenger.Soyad;
    this.identityNumber = passenger.TCKimlikNo;
    this.gender = passenger.Cinsiyet;
    this.birthDate = passenger.DogumTarih;
    this.type = passenger.Tip;
    this.price = passenger.Fiyat;
    this.serviceFee = passenger.ServisUcret;
    this.tax = passenger.Vergi;
    this.eTicketNumber = passenger.EBiletNo;
    this.fuelConsumption = passenger.YakitHarc;
    this.collectedTax = passenger.AlanVergi;
    this.hasThyCip = passenger.ThyCipVarMi;
    this.isTcvCitizen = passenger.TCVatandasiMi;
    this.ticketCancellationServiceFee = passenger.BiletIptalHizmetiUcret;
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
    this.isAdditionalService = passenger.EkHizmetMi;
    this.additionalServiceId = passenger.EkHizmetId;
    this.status1 = passenger.Durum1;
    this.status1Date = passenger.Durum1Tarih;
    this.activeStatus = passenger.AktifDurum;
  }
}

export class SegmentDomesticFlightDto {
  id: string;
  pnrId: string;
  departure: string;
  arrival: string;
  flightNumber: string;
  departureDate: string;
  arrivalDate: string;
  carrierCompany: string;
  class: string;
  flightDuration: string;
  isReturnTrip: string;
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
  ticketCancellationActive: string;
  ticketOpenActive: string;
  travelType: string;
  className: string;
  isMealPaid: string;
  flightDurationMinutes: string;
  cancellationDurationBeforeFlightMinutes: string;

  constructor(segment: SegmentDomesticFlight) {
    this.id = segment.ID;
    this.pnrId = segment.PNRID;
    this.departure = segment.Kalkis;
    this.arrival = segment.Varis;
    this.flightNumber = segment.SeferNo;
    this.departureDate = segment.KalkisTarih;
    this.arrivalDate = segment.VarisTarih;
    this.carrierCompany = segment.TasiyiciFirma;
    this.class = segment.Sinif;
    this.flightDuration = segment.SeferSure;
    this.isReturnTrip = segment.DonusMu;
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
    this.ticketCancellationActive = segment.BiletIptalAktifMi;
    this.ticketOpenActive = segment.BiletAcigaAlAktifMi;
    this.travelType = segment.SeyahatTipi;
    this.className = segment.SinifAd;
    this.isMealPaid = segment.YemekUcretliMi;
    this.flightDurationMinutes = segment.SeferSureDk;
    this.cancellationDurationBeforeFlightMinutes =
      segment.SefereKadarIptalEdilebilmeSuresiDakika;
  }
}

export class OpenTicketDomesticFlightDto {
  collectionAmount: string;
  spentAmount: string;
  outstandingAmount: string;
  earnedPoints: string;
  spentPoints: string;
  netPoints: string;
  trackingNumber: string;

  constructor(openTicket: OpenTicketDomesticFlight) {
    this.collectionAmount = openTicket.Tahsilat;
    this.spentAmount = openTicket.HarcananTutar;
    this.outstandingAmount = openTicket.AcikTutar;
    this.earnedPoints = openTicket.KazanilanPuan;
    this.spentPoints = openTicket.HarcananPuan;
    this.netPoints = openTicket.NetPuan;
    this.trackingNumber = openTicket.TakipNo;
  }
}

export class MembershipDomesticFlightDto {
  milparaCardNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  identityNumber: string;
  gender: string;

  constructor(membership: MembershipDomesticFlight) {
    this.milparaCardNumber = membership.MilparaKartNo;
    this.firstName = membership.Ad;
    this.lastName = membership.Soyad;
    this.email = membership.Email;
    this.mobilePhone = membership.CepTel;
    this.identityNumber = membership.TcKimlikNo;
    this.gender = membership.Cinsiyet;
  }
}

export class CollectionDomesticFlightDto {
  date: string;
  agency: string;
  transactionType: string;
  type: string;
  amount: string;

  constructor(collection: CollectionDomesticFlight) {
    this.date = collection.Tarih;
    this.agency = collection.Acente;
    this.transactionType = collection.IslemTip;
    this.type = collection.Tip;
    this.amount = collection.Tutar;
  }
}

export class PnrTransactionDetailDomesticFlightDto {
  pnr: string;
  transactionType: string;
  date: string;
  company: string;
  departureArrival: string;
  fullName: string;
  amount: string;

  constructor(detail: PnrTransactionDetailDomesticFlight) {
    this.pnr = detail.PNR;
    this.transactionType = detail.IslemTipi;
    this.date = detail.Tarih;
    this.company = detail.Firma;
    this.departureArrival = detail.KalkisVaris;
    this.fullName = detail.AdSoyad;
    this.amount = detail.Tutar;
  }
}

export class InvoiceDomesticFlightDto {
  id: string;
  pnrId: string;
  invoiceType: string;
  personFirstName: string;
  personLastName: string;
  personIdentityNumber: string;
  personAddress: string;

  constructor(invoice: InvoiceDomesticFlight) {
    this.id = invoice.ID;
    this.pnrId = invoice.PNRID;
    this.invoiceType = invoice.FaturaTip;
    this.personFirstName = invoice.KisiAd;
    this.personLastName = invoice.KisiSoyad;
    this.personIdentityNumber = invoice.KisiTcKimlikNo;
    this.personAddress = invoice.KisiAdres;
  }
}

export class CommissionDomesticFlightDto {
  agency: string;
  amount: string;
  rate: string;

  constructor(commission: CommissionDomesticFlight) {
    this.agency = commission.Acente;
    this.amount = commission.Tutar;
    this.rate = commission.Oran;
  }
}

export class SeatNumbersDomesticFlightDto {
  pnrSegmentId: string;
  pnrPassengerId: string;
  baggageAmount: string;
  baggageUnit: string;
  baggageCount: string;
  personalBaggage: string;
  cabinBaggage: string;
  baggageInfo: string;

  constructor(seatNumbers: SeatNumbersDomesticFlight) {
    this.pnrSegmentId = seatNumbers.PNRSegmentID;
    this.pnrPassengerId = seatNumbers.PNRYolcuID;
    this.baggageAmount = seatNumbers.BagajMiktar;
    this.baggageUnit = seatNumbers.BagajBirim;
    this.baggageCount = seatNumbers.BagajAdet;
    this.personalBaggage = seatNumbers.KisiselBagaj;
    this.cabinBaggage = seatNumbers.KabinBagaj;
    this.baggageInfo = seatNumbers.BagajBilgi;
  }
}

export class AgencyPrepaymentDomesticFlightDto {
  installmentCount: string;
  dueDifference: string;
  amount: string;

  constructor(prepayment: AgencyPrepaymentDomesticFlight) {
    this.installmentCount = prepayment.TaksitSayi;
    this.dueDifference = prepayment.VadeFark;
    this.amount = prepayment.Tutar;
  }
}

export class PnrExtraServiceSegmentDomesticFlightDto {
  id: string;
  pnrId: string;
  departure: string;
  arrival: string;
  flightNumber: string;
  departureDate: string;
  arrivalDate: string;
  carrierCompany: string;
  class: string;
  flightDuration: string;
  isReturnTrip: string;
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
  ticketCancellationActive: string;
  ticketOpenActive: string;
  flightStatus: {
    hasCancellationOrChange: string;
  };

  constructor(extraServiceSegment: PnrExtraServiceSegmentDomesticFlight) {
    this.id = extraServiceSegment.ID;
    this.pnrId = extraServiceSegment.PNRID;
    this.departure = extraServiceSegment.Kalkis;
    this.arrival = extraServiceSegment.Varis;
    this.flightNumber = extraServiceSegment.SeferNo;
    this.departureDate = extraServiceSegment.KalkisTarih;
    this.arrivalDate = extraServiceSegment.VarisTarih;
    this.carrierCompany = extraServiceSegment.TasiyiciFirma;
    this.class = extraServiceSegment.Sinif;
    this.flightDuration = extraServiceSegment.SeferSure;
    this.isReturnTrip = extraServiceSegment.DonusMu;
    this.departureCode = extraServiceSegment.KalkisKod;
    this.arrivalCode = extraServiceSegment.VarisKod;
    this.departurePointId = extraServiceSegment.KalkisNoktaID;
    this.arrivalPointId = extraServiceSegment.VarisNoktaID;
    this.aircraftTypeId = extraServiceSegment.UcakTipID;
    this.classType = extraServiceSegment.SinifTip;
    this.companyName = extraServiceSegment.FirmaAd;
    this.companyCode = extraServiceSegment.FirmaKod;
    this.companyId = extraServiceSegment.FirmaID;
    this.companyNumber = extraServiceSegment.FirmaNo;
    this.departureAirport = extraServiceSegment.KalkisHavaalan;
    this.arrivalAirport = extraServiceSegment.VarisHavaalan;
    this.ticketCancellationActive = extraServiceSegment.BiletIptalAktifMi;
    this.ticketOpenActive = extraServiceSegment.BiletAcigaAlAktifMi;
    this.flightStatus = {
      hasCancellationOrChange:
        extraServiceSegment.UcuslarinHavayolundakiSonDurumu
          .UcuslardaIptalveyaDegisiklikVarMi,
    };
  }
}

export class PnrSearchDomesticFlightDto {
  constructor(
    public pnr: PnrDomesticFlightDto,
    public passenger: PassengerDomesticFlightDto,
    public segment: SegmentDomesticFlightDto,
    public openTicket: OpenTicketDomesticFlightDto,
    public membership: MembershipDomesticFlightDto,
    public collection: CollectionDomesticFlightDto,
    public pnrTransactionDetail: PnrTransactionDetailDomesticFlightDto,
    public invoice: InvoiceDomesticFlightDto,
    public commission: CommissionDomesticFlightDto,
    public seatNumbers: SeatNumbersDomesticFlightDto,
    public agencyPrepayment: AgencyPrepaymentDomesticFlightDto,
    public pnrExtraServiceSegment: PnrExtraServiceSegmentDomesticFlightDto,
  ) {}
}
