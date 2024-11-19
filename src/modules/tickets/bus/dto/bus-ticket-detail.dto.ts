// info regarding the bus
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// types
import {
  BusTrip,
  PaymentRule,
  Seat,
  TravelType,
} from '../services/biletall/types/biletall-bus-search.type';
import { DateISODate, DateTime } from '@app/common/types/datetime.type';
import * as dayjs from 'dayjs';
import { BusRouteDetailDto } from './bus-route.dto';

// plate, driver...
export class BusTicketDetailRequestDto {
  constructor(data: Omit<BusTicketDetailRequestDto, 'date' | 'time'>) {
    Object.assign(this, data);
  }

  @ApiProperty({
    description: 'Company number',
    example: '0',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  companyNumber: string;

  @ApiProperty({
    description: 'The departure point ID, which is a required field.',
    example: '84',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  departurePointId: string;

  @ApiProperty({
    description: 'The arrival point ID, which is a required field.',
    example: '738',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  arrivalPointId: string;

  @ApiProperty({
    description: 'Date and Time of the trip in the format YYYY-MM-ddTHH:mm:SS',
    example: '2024-09-20T15:00:00',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  travelStartDateTime: DateTime;

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

  get date(): DateISODate {
    return dayjs(this.travelStartDateTime).format('YYYY-MM-DD') as DateISODate;
  }

  get time(): DateTime {
    return this.travelStartDateTime as DateTime;
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
  idNumberRequiredForBranchSale: boolean;
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
  canProcessWithPassportNumber: boolean;
  canSelectSeatsOfDifferentGenders: string;
  busSeatLayout: string;
  busHESCodeMandatory: string;
  doubleSeatCanBeSoldToSinglePassenger: string;
  canSellDoubleSeatsToSinglePassengerIfSingleSeatsAreFull: string;
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
    if (trip.OtobusTipSinif !== undefined) {
      const internetTicketPrice = Number(trip.BiletFiyatiInternet);
      const classDifferencePrice = Number(trip.BiletFiyatiSinifFarki);
      const totalPrice = (internetTicketPrice + classDifferencePrice).toFixed(
        2,
      );

      this.busTypeClass = (() => {
        switch (trip.OtobusTipSinif) {
          case '0':
            return `Bütün koltukların fiyatı ${internetTicketPrice.toFixed(
              2,
            )} TL`;

          case '1':
            return `Bütün koltukların fiyatı  ${totalPrice} TL`;

          case '2':
            return `Otobüsün sadece üst kat koltuklarının fiyatı ${totalPrice} TL`;

          case '3':
            return `Otobüsün sadece alt kat koltuklarının fiyatı ${totalPrice} TL`;

          default:
            return `${internetTicketPrice.toFixed(2)} TL`;
        }
      })();
    }
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
      trip.SubeSatistaTcKimlikNoYazmakZorunlu === '1' ? true : false;
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
    this.sellableSeatCount = `${trip.SatilabilirKoltukSayi}  - Şirket tarafından belirlenen sayıdır. Bu, otobüste satılabilecek toplam koltuk sayısını gösterir. Bu sayıdan daha fazla işlem gönderdiğinizde hata alırsınız.`;
    this.reservationCannotBeMadeReason = trip.RezervasyonNedenYapilamaz;
    if (
      trip.FirmaMaxToplamBiletFiyati !== undefined &&
      Number(trip.FirmaMaxToplamBiletFiyati) > 0
    ) {
      const totalPrice = Number(trip.FirmaMaxToplamBiletFiyati).toFixed(2);
      this.companyMaxTotalTicketPrice = `${totalPrice} TL - İlgili otobüs için şirket tarafından belirlenen maksimum işlem tutarıdır. Bu değeri aşan işlemlerinizde hata alırsınız.`;
    }
    this.canProcessWithPassportNumber =
      trip.PasaportNoIleIslemYapilirMi === '1' ? true : false;
    this.canSelectSeatsOfDifferentGenders =
      trip.FarkliCinsiyetteKoltuklarSecilebilirMi === '1' ? 'true' : 'false';
    this.busSeatLayout = trip.OtobusKoltukBoslukSemasi;
    this.busHESCodeMandatory = trip.OtobusHesKoduZorunluMu;
    this.doubleSeatCanBeSoldToSinglePassenger =
      trip.CiftKoltukTekYolcuyaSatilabilirMi === '1' ? 'true' : 'false';
    this.canSellDoubleSeatsToSinglePassengerIfSingleSeatsAreFull =
      trip.TekliKoltuklarDoluysaCiftliKoltuktanSatisYapilabilirMi === '1'
        ? 'true'
        : 'false';
    this.approximateTravelDuration = trip.YaklasikSeyahatSuresi;
    this.travelDurationDisplayType = trip.SeyahatSuresiGosterimTipi;
    this.canSelectSeatsWithDifferentPrices =
      trip.FarkliFiyattaKoltuklarSecilebilirMi === '1' ? 'true' : 'false';
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
  seatStr: string;
  seatNumber: string;
  seatSituation: string;
  seatSideSituation: string;
  internetSeatPrice: string;

  constructor(seat: Seat) {
    if (seat.KoltukStr !== undefined) {
      const seatMap: { [key: string]: string } = {
        '01': '1 Numaralı koltuk',
        KO: 'Koridor',
        KA: 'Kapı (ayrı ayrı değerler birleşiyor)',
        PI: 'Kapı (ayrı ayrı değerler birleşiyor)',
        MA: 'Masa (ayrı ayrı değerler birleşiyor)',
        SA: 'Masa (ayrı ayrı değerler birleşiyor)',
        PR: 'Personel Koltuğu',
      };

      const seatDescription = seatMap[seat.KoltukStr.trim()];

      this.seatStr = seatDescription ? seatDescription : seat.KoltukStr.trim();
    } else {
      this.seatStr = 'Koltuk bilgisi yok';
    }
    if (seat.KoltukNo !== undefined) {
      this.seatNumber = seat.KoltukNo;
      if (this.seatNumber === '-1' || this.seatNumber === '-3') {
        this.seatNumber += ' ( Koridor, Kapı veya Masaya denk gelen yerdir.)';
      }
    } else {
      this.seatNumber = 'Koltuk numarası yok';
    }
    this.seatSituation = seat.Durum;
    this.seatSideSituation = seat.DurumYan;
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

export class BusDetailDto {
  constructor(
    public bus: BusTripDto,
    public seats: BusSeatDto[],
    public travelTypes: BusTravelTypeDto[],
    public paymentRules: CompanyPaymentRulesDto,
  ) {}
}

export class BusTicketDetailDto {
  constructor(
    public busDetail: BusDetailDto,
    public routeDetail: BusRouteDetailDto[],
  ) {}
}
