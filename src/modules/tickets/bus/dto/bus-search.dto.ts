// info regarding the bus

import {} from '@app/common/types/datetime.type';
import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';
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
  time!: string;

  @IsInt()
  @IsNotEmpty()
  routeNumber!: number;

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
  LocalDateTime?: string;
  InternetDateTime?: string;
  DepartureName?: string;
  ArrivalName?: string;
  RouteNumber?: string;
  PriceChangeable?: string;
  TicketPrice1?: string;
  TicketPrice2?: string;
  TicketPrice3?: string;
  InternetTicketPrice?: string;
  ClassDifferenceTicketPrice?: string;
  SingleSeatDifferenceTicketPrice?: string;
  GuestTicketPrice?: string;
  SellsGuestTickets?: string;
  SellsDiscountedTicketsForDisabled?: string;
  SellsQuotaTickets?: string;
  IsReservationActive?: string;
  IsSaleActive?: string;
  MaximumReservationDateTime?: string;
  BusType?: string;
  BusTypeClass?: string;
  BusTypeSecondFloorRow?: string;
  BusPlate?: string;
  BusCaptainName?: string;
  BusHostessName?: string;
  DepartureTime?: string;
  BusTripMessage?: string;
  BusBranchMessage?: string;
  PlatformNumber?: string;
  DepartureTerminalName?: string;
  NightDescription?: string;
  MaximumEmptyFemaleSeats?: string;
  BranchTicketPort?: string;
  TotalPassengerPoints?: string;
  PassengerPointsMultiplier?: string;
  OccupancyRateDiscountApplied?: string;
  BusTypeFeature?: string;
  BackwardSeats?: string;
  IDNumberRequiredForBranchSale?: string;
  TravelDuration?: string;
  TripTypeDescription?: string;
  BusTypeDescription?: string;
  CompanyBestPriceActive?: string;
  BusMessage?: string;
  Facilities?: string;
  Payment3DSecureActive?: string;
  Payment3DSecureMandatory?: string;
  PaypalUpperLimit?: string;
  MaximumEmptyMaleSeats?: string;
  SellableSeatCount?: string;
  ReservationCannotBeMadeReason?: string;
  CompanyMaxTotalTicketPrice?: string;
  CanProcessWithPassportNumber?: string;
  CanSelectSeatsOfDifferentGenders?: string;
  BusSeatLayout?: string;
  BusHESCodeMandatory?: string;
  DoubleSeatCanBeSoldToSinglePassenger?: string;
  SingleSeatsFullDoubleSeatsSalePossible?: string;
  ApproximateTravelDuration?: string;
  TravelDurationDisplayType?: string;
  CanSelectSeatsWithDifferentPrices?: string;
  TicketCancellationActive?: string;
  OpenMoneyUsageActive?: string;
  CancellationTimeUntilDepartureMinutes?: string;
  DeparturePointID?: string;
  DeparturePoint?: string;
  ArrivalPointID?: string;
  ArrivalPoint?: string;

  SeatString?: string;
  SeatNumber?: string;
  Status?: string;
  AdjacentStatus?: string;
  InternetSeatPrice?: string;

  TravelType?: string;
  TravelName?: string;
  TicketPrice?: string;
  TicketPriceClassDifference?: string;
  SingleSeatPriceDifference?: string;

  typeFeature?: string;
  typeFeatureDescription?: string;
  typeFeatureDetail?: string;
  typeFeatureIcon?: string;

  PaymentRule3DSecureActive?: string;
  PaymentRule3DSecureMandatory?: string;
  OpenMoneyPaymentActive?: string;
  PrePaymentActive?: string;
  ParakodPaymentActive?: string;
  BkmPaymentActive?: string;
  PaypalPaymentActive?: string;
  PaymentRulePaypalUpperLimit?: string;
  HopiActive?: string;
  MasterpassActive?: string;
  FastPayPaymentActive?: string;
  GarantiPayPaymentActive?: string;

  constructor(
    trip?: BusTrip,
    seat?: Seat,
    travelType?: TravelType,
    feature?: BusFeature,
    paymentRule?: PaymentRule,
  ) {
    if (trip) {
      this.LocalDateTime = trip.YerelTarihSaat;
      this.InternetDateTime = trip.InternetTarihSaat;
      this.DepartureName = trip.KalkisAdi;
      this.ArrivalName = trip.VarisAdi;
      this.RouteNumber = trip.HatNo;
      this.PriceChangeable = trip.FiyatDegistirebilir;
      this.TicketPrice1 = trip.BiletFiyati1;
      this.TicketPrice2 = trip.BiletFiyati2;
      this.TicketPrice3 = trip.BiletFiyati3;
      this.InternetTicketPrice = trip.BiletFiyatiInternet;
      this.ClassDifferenceTicketPrice = trip.BiletFiyatiSinifFarki;
      this.SingleSeatDifferenceTicketPrice = trip.BiletTekKoltukFarki;
      this.GuestTicketPrice = trip.BiletFiyatiMisafir;
      this.SellsGuestTickets = trip.MisafirBiletSatar;
      this.SellsDiscountedTicketsForDisabled = trip.OzurluIndirmliBiletSatar;
      this.SellsQuotaTickets = trip.KontenjanliBiletSatar;
      this.IsReservationActive = trip.RezervasyonAktifMi;
      this.IsSaleActive = trip.SatisAktifMi;
      this.MaximumReservationDateTime = trip.MaximumRezerveTarihiSaati;
      this.BusType = trip.OtobusTip;
      this.BusTypeClass = trip.OtobusTipSinif;
      this.BusTypeSecondFloorRow = trip.OtobusTipIkinciKatSira;
      this.BusPlate = trip.OtobusPlaka;
      this.BusCaptainName = trip.OtobusKaptanAdi;
      this.BusHostessName = trip.OtobusHostesAdi;
      this.DepartureTime = trip.Okalkti;
      this.BusTripMessage = trip.OtobusSeferMesaji;
      this.BusBranchMessage = trip.OtobusSubeMesaji;
      this.PlatformNumber = trip.PeronNo;
      this.DepartureTerminalName = trip.KalkisTerminalAdi;
      this.NightDescription = trip.GeceAciklamasi;
      this.MaximumEmptyFemaleSeats = trip.MaximumBosBayanYaniSayisi;
      this.BranchTicketPort = trip.SubeBiletPort;
      this.TotalPassengerPoints = trip.YolcuUyePuanToplam;
      this.PassengerPointsMultiplier = trip.YolcuUyePuanCarpan;
      this.OccupancyRateDiscountApplied = trip.DolulukOraniIndirimiYapildi;
      this.BusTypeFeature = trip.OTipOzellik;
      this.BackwardSeats = trip.YonuTersKoltuklar;
      this.IDNumberRequiredForBranchSale =
        trip.SubeSatistaTcKimlikNoYazmakZorunlu;
      this.TravelDuration = trip.SeyahatSuresi;
      this.TripTypeDescription = trip.SeferTipiAciklamasi;
      this.BusTypeDescription = trip.OTipAciklamasi;
      this.CompanyBestPriceActive = trip.FirmaEnUygunFiyatAktifMi;
      this.BusMessage = trip.OtobusMesaj;
      this.Facilities = trip.Tesisler;
      this.Payment3DSecureActive = trip.Odeme3DSecureAktifMi;
      this.Payment3DSecureMandatory = trip.Odeme3DSecureZorunluMu;
      this.PaypalUpperLimit = trip.PaypalUstLimit;
      this.MaximumEmptyMaleSeats = trip.MaximumBosBayYaniSayisi;
      this.SellableSeatCount = trip.SatilabilirKoltukSayi;
      this.ReservationCannotBeMadeReason = trip.RezervasyonNedenYapilamaz;
      this.CompanyMaxTotalTicketPrice = trip.FirmaMaxToplamBiletFiyati;
      this.CanProcessWithPassportNumber = trip.PasaportNoIleIslemYapilirMi;
      this.CanSelectSeatsOfDifferentGenders =
        trip.FarkliCinsiyetteKoltuklarSecilebilirMi;
      this.BusSeatLayout = trip.OtobusKoltukBoslukSemasi;
      this.BusHESCodeMandatory = trip.OtobusHesKoduZorunluMu;
      this.DoubleSeatCanBeSoldToSinglePassenger =
        trip.CiftKoltukTekYolcuyaSatilabilirMi;
      this.SingleSeatsFullDoubleSeatsSalePossible =
        trip.TekliKoltuklarDoluysaCiftliKoltuktanSatisYapilabilirMi;
      this.ApproximateTravelDuration = trip.YaklasikSeyahatSuresi;
      this.TravelDurationDisplayType = trip.SeyahatSuresiGosterimTipi;
      this.CanSelectSeatsWithDifferentPrices =
        trip.FarkliFiyattaKoltuklarSecilebilirMi;
      this.TicketCancellationActive = trip.BiletIptalAktifMi;
      this.OpenMoneyUsageActive = trip.AcikParaKullanimAktifMi;
      this.CancellationTimeUntilDepartureMinutes =
        trip.SefereKadarIptalEdilebilmeSuresiDakika;
      this.DeparturePointID = trip.KalkisNoktaID;
      this.DeparturePoint = trip.KalkisNokta;
      this.ArrivalPointID = trip.VarisNoktaID;
      this.ArrivalPoint = trip.VarisNokta;
    }

    if (seat) {
      this.SeatString = seat.KoltukStr;
      this.SeatNumber = seat.KoltukNo;
      this.Status = seat.Durum;
      this.AdjacentStatus = seat.DurumYan;
      this.InternetSeatPrice = seat.KoltukFiyatiInternet;
    }

    if (travelType) {
      this.TravelType = travelType.SeyahatTipi;
      this.TravelName = travelType.SeyahatAdi;
      this.TicketPrice = travelType.BiletFiyati;
      this.TicketPriceClassDifference = travelType.BiletFiyatSinifFarki;
      this.SingleSeatPriceDifference = travelType.BiletTekKoltukFarki;
    }
    if (feature) {
      this.typeFeature = feature.O_Tip_Ozellik;
      this.typeFeatureDescription = feature.O_Tip_Ozellik_Aciklama;
      this.typeFeatureDetail = feature.O_Tip_Ozellik_Detay;
      this.typeFeatureIcon = feature.O_Tip_Ozellik_Icon;
    }

    if (paymentRule) {
      this.PaymentRule3DSecureActive = paymentRule.Odeme3DSecureAktifMi;
      this.PaymentRule3DSecureMandatory = paymentRule.Odeme3DSecureZorunluMu;
      this.OpenMoneyPaymentActive = paymentRule.AcikParaliOdemeAktifMi;
      this.PrePaymentActive = paymentRule.OnOdemeAktifMi;
      this.ParakodPaymentActive = paymentRule.ParakodOdemeAktifMi;
      this.BkmPaymentActive = paymentRule.BkmOdemeAktifMi;
      this.PaypalPaymentActive = paymentRule.PaypalOdemeAktifMi;
      this.PaymentRulePaypalUpperLimit = paymentRule.PaypalUstLimit;
      this.HopiActive = paymentRule.HopiAktifMi;
      this.MasterpassActive = paymentRule.MasterpassAktifMi;
      this.FastPayPaymentActive = paymentRule.FastPayOdemeAktifMi;
      this.GarantiPayPaymentActive = paymentRule.GarantiPayOdemeAktifMi;
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
