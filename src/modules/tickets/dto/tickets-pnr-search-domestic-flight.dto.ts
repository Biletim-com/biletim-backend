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
    this.id = pnr.ID[0];
    this.pnr = pnr.PNR[0];
    this.pnrType = pnr.PnrTip[0];
    this.trackingNumber = pnr.TakipNo[0];
    this.firstName = pnr.Ad[0];
    this.lastName = pnr.Soyad[0];
    this.phone = pnr.Tel[0];
    this.email = pnr.Email[0];
    this.identityNumber = pnr.TCKimlikNo[0];
    this.smsSendingCount = pnr.SMSGonderimSayi[0];
    this.landline = pnr.SabitTel[0];
    this.invoiceRequested = pnr.FaturalansinMi[0];
    this.invoicePersonFirstName = pnr.FaturaKisiAd[0];
    this.invoicePersonLastName = pnr.FaturaKisiSoyad[0];
    this.invoicePersonIdentityNumber = pnr.FaturaKisiTCKNo[0];
    this.invoicePersonAddress = pnr.FaturaKisiAdres[0];
    this.isOffline = pnr.OfflineMi[0];
    this.memberId = pnr.UyeID[0];
    this.isIndividualEfatura = pnr.CM_EFaturaBireyselMi[0];
    this.informationAgreementId = pnr.AydinlatmaSozlesmeID[0];
    this.explicitConsentAgreementId = pnr.AcikRizaSozlesmeID[0];
    this.serviceAgreementId = pnr.HizmetSozlesmeID[0];
    this.countryPhoneCode = pnr.UlkeTelefonKodu[0];
    this.companyNumber = pnr.FirmaNo[0];
    this.totalDiscount = pnr.ToplamIndirim[0];
    this.serviceFeeDiscount = pnr.ServisUcretIndirim[0];
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
    this.pnr = passenger.PNR[0];
    this.id = passenger.ID[0];
    this.pnrId = passenger.PNRID[0];
    this.firstName = passenger.Ad[0];
    this.lastName = passenger.Soyad[0];
    this.identityNumber = passenger.TCKimlikNo[0];
    this.gender = passenger.Cinsiyet[0];
    this.birthDate = passenger.DogumTarih[0];
    this.type = passenger.Tip[0];
    this.price = passenger.Fiyat[0];
    this.serviceFee = passenger.ServisUcret[0];
    this.tax = passenger.Vergi[0];
    this.eTicketNumber = passenger.EBiletNo[0];
    this.fuelConsumption = passenger.YakitHarc[0];
    this.collectedTax = passenger.AlanVergi[0];
    this.hasThyCip = passenger.ThyCipVarMi[0];
    this.isTcvCitizen = passenger.TCVatandasiMi[0];
    this.ticketCancellationServiceFee = passenger.BiletIptalHizmetiUcret[0];
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
    this.isAdditionalService = passenger.EkHizmetMi[0];
    this.additionalServiceId = passenger.EkHizmetId[0];
    this.status1 = passenger.Durum1[0];
    this.status1Date = passenger.Durum1Tarih[0];
    this.activeStatus = passenger.AktifDurum[0];
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
    this.id = segment.ID[0];
    this.pnrId = segment.PNRID[0];
    this.departure = segment.Kalkis[0];
    this.arrival = segment.Varis[0];
    this.flightNumber = segment.SeferNo[0];
    this.departureDate = segment.KalkisTarih[0];
    this.arrivalDate = segment.VarisTarih[0];
    this.carrierCompany = segment.TasiyiciFirma[0];
    this.class = segment.Sinif[0];
    this.flightDuration = segment.SeferSure[0];
    this.isReturnTrip = segment.DonusMu[0];
    this.departureCode = segment.KalkisKod[0];
    this.arrivalCode = segment.VarisKod[0];
    this.departurePointId = segment.KalkisNoktaID[0];
    this.arrivalPointId = segment.VarisNoktaID[0];
    this.aircraftTypeId = segment.UcakTipID[0];
    this.classType = segment.SinifTip;
    this.companyName = segment.FirmaAd[0];
    this.companyCode = segment.FirmaKod[0];
    this.companyId = segment.FirmaID[0];
    this.companyNumber = segment.FirmaNo[0];
    this.departureAirport = segment.KalkisHavaalan[0];
    this.arrivalAirport = segment.VarisHavaalan[0];
    this.ticketCancellationActive = segment.BiletIptalAktifMi[0];
    this.ticketOpenActive = segment.BiletAcigaAlAktifMi[0];
    this.travelType = segment.SeyahatTipi[0];
    this.className = segment.SinifAd[0];
    this.isMealPaid = segment.YemekUcretliMi[0];
    this.flightDurationMinutes = segment.SeferSureDk[0];
    this.cancellationDurationBeforeFlightMinutes =
      segment.SefereKadarIptalEdilebilmeSuresiDakika[0];
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
    this.collectionAmount = openTicket.Tahsilat[0];
    this.spentAmount = openTicket.HarcananTutar[0];
    this.outstandingAmount = openTicket.AcikTutar[0];
    this.earnedPoints = openTicket.KazanilanPuan[0];
    this.spentPoints = openTicket.HarcananPuan[0];
    this.netPoints = openTicket.NetPuan[0];
    this.trackingNumber = openTicket.TakipNo[0];
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
    this.milparaCardNumber = membership.MilparaKartNo[0];
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
    this.date = collection.Tarih[0];
    this.agency = collection.Acente[0];
    this.transactionType = collection.IslemTip[0];
    this.type = collection.Tip[0];
    this.amount = collection.Tutar[0];
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
    this.pnr = detail.PNR[0];
    this.transactionType = detail.IslemTipi[0];
    this.date = detail.Tarih[0];
    this.company = detail.Firma[0];
    this.departureArrival = detail.KalkisVaris[0];
    this.fullName = detail.AdSoyad[0];
    this.amount = detail.Tutar[0];
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
    this.id = invoice.ID[0];
    this.pnrId = invoice.PNRID[0];
    this.invoiceType = invoice.FaturaTip[0];
    this.personFirstName = invoice.KisiAd[0];
    this.personLastName = invoice.KisiSoyad[0];
    this.personIdentityNumber = invoice.KisiTcKimlikNo[0];
    this.personAddress = invoice.KisiAdres[0];
  }
}

export class CommissionDomesticFlightDto {
  agency: string;
  amount: string;
  rate: string;

  constructor(commission: CommissionDomesticFlight) {
    this.agency = commission.Acente[0];
    this.amount = commission.Tutar[0];
    this.rate = commission.Oran[0];
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
    this.pnrSegmentId = seatNumbers.PNRSegmentID[0];
    this.pnrPassengerId = seatNumbers.PNRYolcuID[0];
    this.baggageAmount = seatNumbers.BagajMiktar[0];
    this.baggageUnit = seatNumbers.BagajBirim[0];
    this.baggageCount = seatNumbers.BagajAdet[0];
    this.personalBaggage = seatNumbers.KisiselBagaj;
    this.cabinBaggage = seatNumbers.KabinBagaj;
    this.baggageInfo = seatNumbers.BagajBilgi[0];
  }
}

export class AgencyPrepaymentDomesticFlightDto {
  installmentCount: string;
  dueDifference: string;
  amount: string;

  constructor(prepayment: AgencyPrepaymentDomesticFlight) {
    this.installmentCount = prepayment.TaksitSayi[0];
    this.dueDifference = prepayment.VadeFark[0];
    this.amount = prepayment.Tutar[0];
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
    this.id = extraServiceSegment.ID[0];
    this.pnrId = extraServiceSegment.PNRID[0];
    this.departure = extraServiceSegment.Kalkis[0];
    this.arrival = extraServiceSegment.Varis[0];
    this.flightNumber = extraServiceSegment.SeferNo[0];
    this.departureDate = extraServiceSegment.KalkisTarih[0];
    this.arrivalDate = extraServiceSegment.VarisTarih[0];
    this.carrierCompany = extraServiceSegment.TasiyiciFirma[0];
    this.class = extraServiceSegment.Sinif[0];
    this.flightDuration = extraServiceSegment.SeferSure[0];
    this.isReturnTrip = extraServiceSegment.DonusMu[0];
    this.departureCode = extraServiceSegment.KalkisKod[0];
    this.arrivalCode = extraServiceSegment.VarisKod[0];
    this.departurePointId = extraServiceSegment.KalkisNoktaID[0];
    this.arrivalPointId = extraServiceSegment.VarisNoktaID[0];
    this.aircraftTypeId = extraServiceSegment.UcakTipID[0];
    this.classType = extraServiceSegment.SinifTip;
    this.companyName = extraServiceSegment.FirmaAd[0];
    this.companyCode = extraServiceSegment.FirmaKod[0];
    this.companyId = extraServiceSegment.FirmaID[0];
    this.companyNumber = extraServiceSegment.FirmaNo[0];
    this.departureAirport = extraServiceSegment.KalkisHavaalan[0];
    this.arrivalAirport = extraServiceSegment.VarisHavaalan[0];
    this.ticketCancellationActive = extraServiceSegment.BiletIptalAktifMi[0];
    this.ticketOpenActive = extraServiceSegment.BiletAcigaAlAktifMi[0];
    this.flightStatus = {
      hasCancellationOrChange:
        extraServiceSegment.UcuslarinHavayolundakiSonDurumu
          .UcuslardaIptalveyaDegisiklikVarMi[0],
    };
  }
}

export class PnrSearchDomesticFlightDto {
  constructor(
    public pnr: PnrDomesticFlightDto[],
    public passenger: PassengerDomesticFlightDto[],
    public segment: SegmentDomesticFlightDto[],
    public openTicket: OpenTicketDomesticFlightDto[],
    public membership: MembershipDomesticFlightDto[],
    public collection: CollectionDomesticFlightDto[],
    public pnrTransactionDetail: PnrTransactionDetailDomesticFlightDto[],
    public invoice: InvoiceDomesticFlightDto[],
    public commission: CommissionDomesticFlightDto[],
    public seatNumbers: SeatNumbersDomesticFlightDto[],
    public agencyPrepayment: AgencyPrepaymentDomesticFlightDto[],
    public pnrExtraServiceSegment: PnrExtraServiceSegmentDomesticFlightDto[],
  ) {}
}
