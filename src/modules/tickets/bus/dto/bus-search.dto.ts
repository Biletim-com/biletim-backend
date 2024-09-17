// info regarding the bus

import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { BusScheduleRequestDto } from './bus-schedule-list.dto';
import { OmitType } from '@nestjs/swagger/dist/type-helpers/omit-type.helper';
import { ApiProperty } from '@nestjs/swagger';
// types
import {
  BusTrip,
  PaymentRule,
  Seat,
  TravelType,
} from '../services/biletall/types/biletall-bus-search.type';
import { BusFeature } from '../services/biletall/types/biletall-bus-feature.type';
import { DateTime } from '@app/common/types/datetime.type';

// plate, driver...
export class BusSearchRequestDto extends OmitType(BusScheduleRequestDto, [
  'includeIntermediatePoints',
  'companyNo',
]) {
  @ApiProperty({
    description: 'Company number',
    example: '0',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  companyNo: string;

  @ApiProperty({
    description: 'The travel date and time in the format yyyy-MM-ddTHH:mm:ss.',
    example: '2024-09-15T12:30:00',
    required: true,
  })
  @IsDateString(
    {},
    { message: 'Date must be in the format yyyy-MM-ddTHH:mm:ss' },
  )
  @IsNotEmpty()
  time: DateTime;

  @ApiProperty({
    description: 'The route number for the bus, required field.',
    example: '3',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  routeNumber: string;

  @ApiProperty({
    description: 'The trip tracking number.',
    example: '2221',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tripTrackingNumber: string;

  constructor(partial: Partial<BusSearchDto>) {
    super(partial);
    Object.assign(this, partial);
    this.operationType = this.operationType ?? 0;
  }
}

export class BusTripDto {
  localDateTime: string;
  internetDateTime: string;
  departureName: string;
  arrivalName: string;
  routeNumber: string;
  priceChangeable: string;
  ticketPrice1: string;
  ticketPrice2: string;
  ticketPrice3: string;
  internetTicketPrice: string;
  classDifferenceTicketPrice: string;
  singleSeatDifferenceTicketPrice: string;
  guestTicketPrice: string;
  sellsGuestTickets: string;
  sellsDiscountedTicketsForDisabled: string;
  sellsQuotaTickets: string;
  isReservationActive: string;
  isSaleActive: string;
  maximumReservationDateTime: string;
  busType: string;
  busTypeClass: string;
  busTypeSecondFloorRow: string;
  busPlate: string;
  busCaptainName: string;
  busHostessName: string;
  departureTime: string;
  busTripMessage: string;
  busBranchMessage: string;
  platformNumber: string;
  departureTerminalName: string;
  nightDescription: string;
  maximumEmptyFemaleSeats: string;
  branchTicketPort: string;
  totalPassengerPoints: string;
  passengerPointsMultiplier: string;
  occupancyRateDiscountApplied: string;
  busTypeFeature: string;
  backwardSeats: string;
  idNumberRequiredForBranchSale: string;
  travelDuration: string;
  tripTypeDescription: string;
  busTypeDescription: string;
  companyBestPriceActive: string;
  busMessage: string;
  facilities: string;
  payment3DSecureActive: string;
  payment3DSecureMandatory: string;
  paypalUpperLimit: string;
  maximumEmptyMaleSeats: string;
  sellableSeatCount: string;
  reservationCannotBeMadeReason: string;
  companyMaxTotalTicketPrice: string;
  canProcessWithPassportNumber: string;
  canSelectSeatsOfDifferentGenders: string;
  busSeatLayout: string;
  busHESCodeMandatory: string;
  doubleSeatCanBeSoldToSinglePassenger: string;
  singleSeatsFullDoubleSeatsSalePossible: string;
  approximateTravelDuration: string;
  travelDurationDisplayType: string;
  canSelectSeatsWithDifferentPrices: string;
  ticketCancellationActive: string;
  openMoneyUsageActive: string;
  cancellationTimeUntilDepartureMinutes: string;
  departurePointID: string;
  departurePoint: string;
  arrivalPointID: string;
  arrivalPoint: string;

  constructor(trip: BusTrip) {
    this.localDateTime = trip.YerelTarihSaat;
    this.internetDateTime = trip.InternetTarihSaat;
    this.departureName = trip.KalkisAdi;
    this.arrivalName = trip.VarisAdi;
    this.routeNumber = trip.HatNo;
    this.priceChangeable = trip.FiyatDegistirebilir;
    this.ticketPrice1 = trip.BiletFiyati1;
    this.ticketPrice2 = trip.BiletFiyati2;
    this.ticketPrice3 = trip.BiletFiyati3;
    this.internetTicketPrice = trip.BiletFiyatiInternet;
    this.classDifferenceTicketPrice = trip.BiletFiyatiSinifFarki;
    this.singleSeatDifferenceTicketPrice = trip.BiletTekKoltukFarki;
    this.guestTicketPrice = trip.BiletFiyatiMisafir;
    this.sellsGuestTickets = trip.MisafirBiletSatar;
    this.sellsDiscountedTicketsForDisabled = trip.OzurluIndirmliBiletSatar;
    this.sellsQuotaTickets = trip.KontenjanliBiletSatar;
    this.isReservationActive = trip.RezervasyonAktifMi;
    this.isSaleActive = trip.SatisAktifMi;
    this.maximumReservationDateTime = trip.MaximumRezerveTarihiSaati;
    this.busType = trip.OtobusTip;
    this.busTypeClass = trip.OtobusTipSinif;
    this.busTypeSecondFloorRow = trip.OtobusTipIkinciKatSira;
    this.busPlate = trip.OtobusPlaka;
    this.busCaptainName = trip.OtobusKaptanAdi;
    this.busHostessName = trip.OtobusHostesAdi;
    this.departureTime = trip.Okalkti;
    this.busTripMessage = trip.OtobusSeferMesaji;
    this.busBranchMessage = trip.OtobusSubeMesaji;
    this.platformNumber = trip.PeronNo;
    this.departureTerminalName = trip.KalkisTerminalAdi;
    this.nightDescription = trip.GeceAciklamasi;
    this.maximumEmptyFemaleSeats = trip.MaximumBosBayanYaniSayisi;
    this.branchTicketPort = trip.SubeBiletPort;
    this.totalPassengerPoints = trip.YolcuUyePuanToplam;
    this.passengerPointsMultiplier = trip.YolcuUyePuanCarpan;
    this.occupancyRateDiscountApplied = trip.DolulukOraniIndirimiYapildi;
    this.busTypeFeature = trip.OTipOzellik;
    this.backwardSeats = trip.YonuTersKoltuklar;
    this.idNumberRequiredForBranchSale =
      trip.SubeSatistaTcKimlikNoYazmakZorunlu;
    this.travelDuration = trip.SeyahatSuresi;
    this.tripTypeDescription = trip.SeferTipiAciklamasi;
    this.busTypeDescription = trip.OTipAciklamasi;
    this.companyBestPriceActive = trip.FirmaEnUygunFiyatAktifMi;
    this.busMessage = trip.OtobusMesaj;
    this.facilities = trip.Tesisler;
    this.payment3DSecureActive = trip.Odeme3DSecureAktifMi;
    this.payment3DSecureMandatory = trip.Odeme3DSecureZorunluMu;
    this.paypalUpperLimit = trip.PaypalUstLimit;
    this.maximumEmptyMaleSeats = trip.MaximumBosBayYaniSayisi;
    this.sellableSeatCount = trip.SatilabilirKoltukSayi;
    this.reservationCannotBeMadeReason = trip.RezervasyonNedenYapilamaz;
    this.companyMaxTotalTicketPrice = trip.FirmaMaxToplamBiletFiyati;
    this.canProcessWithPassportNumber = trip.PasaportNoIleIslemYapilirMi;
    this.canSelectSeatsOfDifferentGenders =
      trip.FarkliCinsiyetteKoltuklarSecilebilirMi;
    this.busSeatLayout = trip.OtobusKoltukBoslukSemasi;
    this.busHESCodeMandatory = trip.OtobusHesKoduZorunluMu;
    this.doubleSeatCanBeSoldToSinglePassenger =
      trip.CiftKoltukTekYolcuyaSatilabilirMi;
    this.singleSeatsFullDoubleSeatsSalePossible =
      trip.TekliKoltuklarDoluysaCiftliKoltuktanSatisYapilabilirMi;
    this.approximateTravelDuration = trip.YaklasikSeyahatSuresi;
    this.travelDurationDisplayType = trip.SeyahatSuresiGosterimTipi;
    this.canSelectSeatsWithDifferentPrices =
      trip.FarkliFiyattaKoltuklarSecilebilirMi;
    this.ticketCancellationActive = trip.BiletIptalAktifMi;
    this.openMoneyUsageActive = trip.AcikParaKullanimAktifMi;
    this.cancellationTimeUntilDepartureMinutes =
      trip.SefereKadarIptalEdilebilmeSuresiDakika;
    this.departurePointID = trip.KalkisNoktaID;
    this.departurePoint = trip.KalkisNokta;
    this.arrivalPointID = trip.VarisNoktaID;
    this.arrivalPoint = trip.VarisNokta;
  }
}

export class BusSeatDto {
  seatString: string;
  seatNumber: string;
  status: string;
  adjacentStatus: string;
  internetSeatPrice: string;

  constructor(seat: Seat) {
    this.seatString = seat.KoltukStr;
    this.seatNumber = seat.KoltukNo;
    this.status = seat.Durum;
    this.adjacentStatus = seat.DurumYan;
    this.internetSeatPrice = seat.KoltukFiyatiInternet;
  }
}

export class BusTravelTypeDto {
  travelType: string;
  travelName: string;
  ticketPrice: string;
  ticketPriceClassDifference: string;
  singleSeatPriceDifference: string;

  constructor(travelType: TravelType) {
    this.travelType = travelType.SeyahatTipi;
    this.travelName = travelType.SeyahatAdi;
    this.ticketPrice = travelType.BiletFiyati;
    this.ticketPriceClassDifference = travelType.BiletFiyatSinifFarki;
    this.singleSeatPriceDifference = travelType.BiletTekKoltukFarki;
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
export class CompanyPaymentRulesDto {
  payment3DSecureActive: boolean;
  payment3DSecureMandatory: boolean;
  openMoneyPaymentActive: boolean;
  prePaymentActive: boolean;
  parakodPaymentActive: boolean;
  bkmPaymentActive: boolean;
  paypalPaymentActive: boolean;
  paymentRulePaypalUpperLimit: string;
  hopiActive: boolean;
  masterpassActive: boolean;
  fastPayPaymentActive: boolean;
  garantiPayPaymentActive: boolean;

  private isActive(status: string): boolean {
    return status === '1';
  }

  constructor(paymentRule: PaymentRule) {
    this.payment3DSecureActive = this.isActive(
      paymentRule.Odeme3DSecureAktifMi,
    );
    this.payment3DSecureMandatory = this.isActive(
      paymentRule.Odeme3DSecureZorunluMu,
    );
    this.openMoneyPaymentActive = this.isActive(
      paymentRule.AcikParaliOdemeAktifMi,
    );
    this.prePaymentActive = this.isActive(paymentRule.OnOdemeAktifMi);
    this.parakodPaymentActive = this.isActive(paymentRule.ParakodOdemeAktifMi);
    this.bkmPaymentActive = this.isActive(paymentRule.BkmOdemeAktifMi);
    this.paypalPaymentActive = this.isActive(paymentRule.PaypalOdemeAktifMi);
    this.paymentRulePaypalUpperLimit = paymentRule.PaypalUstLimit;
    this.hopiActive = this.isActive(paymentRule.HopiAktifMi);
    this.masterpassActive = this.isActive(paymentRule.MasterpassAktifMi);
    this.fastPayPaymentActive = this.isActive(paymentRule.FastPayOdemeAktifMi);
    this.garantiPayPaymentActive = this.isActive(
      paymentRule.GarantiPayOdemeAktifMi,
    );
  }
}

export class BusSearchDto {
  constructor(
    public trip: BusTripDto,
    public seats: BusSeatDto[],
    public travelTypes: BusTravelTypeDto[],
    public features: BusFeaturesDto[],
    public paymentRules: CompanyPaymentRulesDto,
  ) {}
}
