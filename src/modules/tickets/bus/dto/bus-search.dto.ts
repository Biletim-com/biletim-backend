// info regarding the bus

import {} from '@app/common/types/datetime.type';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ScheduleListDto } from './bus-schedule-list.dto';
import { OmitType } from '@nestjs/swagger/dist/type-helpers/omit-type.helper';
import {
  BusTrip,
  PaymentRule,
  Seat,
  TravelType,
} from '../services/biletall/types/biletall-bus-search.type';
import { BusFeature } from '../services/biletall/types/biletall-bus-feature.type';

// plate, driver...
export class BusSearchDto extends OmitType(ScheduleListDto, [
  'includeIntermediatePoints',
]) {
  @IsDateString(
    {},
    { message: 'Date must be in the format yyyy-MM-ddTHH:mm:ss' },
  )
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  routeNumber: string;

  @IsString()
  @IsNotEmpty()
  tripTrackingNumber?: string;

  constructor(partial: Partial<BusSearchDto>) {
    super(partial);
    Object.assign(this, partial);
    this.operationType = this.operationType ?? 0;
  }
}

export class BusSearchResponseDto {
  localDateTime?: string;
  internetDateTime?: string;
  departureName?: string;
  arrivalName?: string;
  routeNumber?: string;
  priceChangeable?: string;
  ticketPrice1?: string;
  ticketPrice2?: string;
  ticketPrice3?: string;
  internetTicketPrice?: string;
  classDifferenceTicketPrice?: string;
  singleSeatDifferenceTicketPrice?: string;
  guestTicketPrice?: string;
  sellsGuestTickets?: string;
  sellsDiscountedTicketsForDisabled?: string;
  sellsQuotaTickets?: string;
  isReservationActive?: string;
  isSaleActive?: string;
  maximumReservationDateTime?: string;
  busType?: string;
  busTypeClass?: string;
  busTypeSecondFloorRow?: string;
  busPlate?: string;
  busCaptainName?: string;
  busHostessName?: string;
  departureTime?: string;
  busTripMessage?: string;
  busBranchMessage?: string;
  platformNumber?: string;
  departureTerminalName?: string;
  nightDescription?: string;
  maximumEmptyFemaleSeats?: string;
  branchTicketPort?: string;
  totalPassengerPoints?: string;
  passengerPointsMultiplier?: string;
  occupancyRateDiscountApplied?: string;
  busTypeFeature?: string;
  backwardSeats?: string;
  idNumberRequiredForBranchSale?: string;
  travelDuration?: string;
  tripTypeDescription?: string;
  busTypeDescription?: string;
  companyBestPriceActive?: string;
  busMessage?: string;
  facilities?: string;
  payment3DSecureActive?: string;
  payment3DSecureMandatory?: string;
  paypalUpperLimit?: string;
  maximumEmptyMaleSeats?: string;
  sellableSeatCount?: string;
  reservationCannotBeMadeReason?: string;
  companyMaxTotalTicketPrice?: string;
  canProcessWithPassportNumber?: string;
  canSelectSeatsOfDifferentGenders?: string;
  busSeatLayout?: string;
  busHESCodeMandatory?: string;
  doubleSeatCanBeSoldToSinglePassenger?: string;
  singleSeatsFullDoubleSeatsSalePossible?: string;
  approximateTravelDuration?: string;
  travelDurationDisplayType?: string;
  canSelectSeatsWithDifferentPrices?: string;
  ticketCancellationActive?: string;
  openMoneyUsageActive?: string;
  cancellationTimeUntilDepartureMinutes?: string;
  departurePointID?: string;
  departurePoint?: string;
  arrivalPointID?: string;
  arrivalPoint?: string;
  seatString?: string;
  seatNumber?: string;
  status?: string;
  adjacentStatus?: string;
  internetSeatPrice?: string;
  travelType?: string;
  travelName?: string;
  ticketPrice?: string;
  ticketPriceClassDifference?: string;
  singleSeatPriceDifference?: string;
  typeFeature?: string;
  typeFeatureDescription?: string;
  typeFeatureDetail?: string;
  typeFeatureIcon?: string;
  paymentRule3DSecureActive?: string;
  paymentRule3DSecureMandatory?: string;
  openMoneyPaymentActive?: string;
  prePaymentActive?: string;
  parakodPaymentActive?: string;
  bkmPaymentActive?: string;
  paypalPaymentActive?: string;
  paymentRulePaypalUpperLimit?: string;
  hopiActive?: string;
  masterpassActive?: string;
  fastPayPaymentActive?: string;
  garantiPayPaymentActive?: string;

  constructor(
    trip?: BusTrip,
    seat?: Seat,
    travelType?: TravelType,
    feature?: BusFeature,
    paymentRule?: PaymentRule,
  ) {
    if (trip) {
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

    if (seat) {
      this.seatString = seat.KoltukStr;
      this.seatNumber = seat.KoltukNo;
      this.status = seat.Durum;
      this.adjacentStatus = seat.DurumYan;
      this.internetSeatPrice = seat.KoltukFiyatiInternet;
    }

    if (travelType) {
      this.travelType = travelType.SeyahatTipi;
      this.travelName = travelType.SeyahatAdi;
      this.ticketPrice = travelType.BiletFiyati;
      this.ticketPriceClassDifference = travelType.BiletFiyatSinifFarki;
      this.singleSeatPriceDifference = travelType.BiletTekKoltukFarki;
    }

    if (feature) {
      this.typeFeature = feature.O_Tip_Ozellik;
      this.typeFeatureDescription = feature.O_Tip_Ozellik_Aciklama;
      this.typeFeatureDetail = feature.O_Tip_Ozellik_Detay;
      this.typeFeatureIcon = feature.O_Tip_Ozellik_Icon;
    }

    if (paymentRule) {
      this.paymentRule3DSecureActive = paymentRule.Odeme3DSecureAktifMi;
      this.paymentRule3DSecureMandatory = paymentRule.Odeme3DSecureZorunluMu;
      this.openMoneyPaymentActive = paymentRule.AcikParaliOdemeAktifMi;
      this.prePaymentActive = paymentRule.OnOdemeAktifMi;
      this.parakodPaymentActive = paymentRule.ParakodOdemeAktifMi;
      this.bkmPaymentActive = paymentRule.BkmOdemeAktifMi;
      this.paypalPaymentActive = paymentRule.PaypalOdemeAktifMi;
      this.paymentRulePaypalUpperLimit = paymentRule.PaypalUstLimit;
      this.hopiActive = paymentRule.HopiAktifMi;
      this.masterpassActive = paymentRule.MasterpassAktifMi;
      this.fastPayPaymentActive = paymentRule.FastPayOdemeAktifMi;
      this.garantiPayPaymentActive = paymentRule.GarantiPayOdemeAktifMi;
    }
  }

  static finalVersionBusSearchResponse(
    trips: BusTrip[],
    seats: Seat[],
    travelTypes: TravelType[],
    features: BusFeature[],
    paymentRules: PaymentRule[],
  ): {
    trips: BusSearchResponseDto[];
    seats: BusSearchResponseDto[];
    travelTypes: BusSearchResponseDto[];
    features: BusSearchResponseDto[];
    paymentRules: BusSearchResponseDto[];
  } {
    return {
      trips: trips.map((trip) => new BusSearchResponseDto(trip)),
      seats: seats.map((seat) => new BusSearchResponseDto(undefined, seat)),
      travelTypes: travelTypes.map(
        (travelType) =>
          new BusSearchResponseDto(undefined, undefined, travelType),
      ),
      features: features.map(
        (feature) =>
          new BusSearchResponseDto(undefined, undefined, undefined, feature),
      ),

      paymentRules: paymentRules.map(
        (paymentRule) =>
          new BusSearchResponseDto(
            undefined,
            undefined,
            undefined,
            undefined,
            paymentRule,
          ),
      ),
    };
  }
}
