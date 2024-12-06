import {
  FlightOption,
  FlightSegment,
  OptionFare,
  OptionFareDetail,
  SegmentClass,
} from '../types/biletall-plane-domistic-flight-schedule.type';

export class FlightOptionDto {
  id: string;
  priceP: string;
  priceE: string;
  priceB: string;
  serviceFeeP: string;
  serviceFeeE: string;
  serviceFeeB: string;
  totalPriceE: string;
  totalPriceB: string;
  totalServiceFeeE: string;
  totalServiceFeeB: string;
  luggageE: string;
  luggageB: string;
  time: string;
  id2: string;
  companyNumber: string;

  constructor(option: FlightOption) {
    this.id = option.ID;
    this.priceP = option.FiyatP;
    this.priceE = option.FiyatE;
    this.priceB = option.FiyatB;
    this.serviceFeeP = option.ServisUcretP;
    this.serviceFeeE = option.ServisUcretE;
    this.serviceFeeB = option.ServisUcretB;
    this.totalPriceE = option.ToplamFiyatE;
    this.totalPriceB = option.ToplamFiyatB;
    this.totalServiceFeeE = option.ToplamServisUcretE;
    this.totalServiceFeeB = option.ToplamServisUcretB;
    this.luggageE = option.BagajE;
    this.luggageB = option.BagajB;
    this.time = option.Vakit;
    this.id2 = option.ID2;
    this.companyNumber = option.FirmaNo;
  }
}

export class DomesticFlightSegmentDto {
  id: string;
  optionId: string;
  companyId: string;
  airlineCode: string;
  airline: string;
  flightNumber: string;
  companyFlightNumber: string;
  flightCode: string;
  departureAirport: string;
  arrivalAirport: string;
  departureCity: string;
  arrivalCity: string;
  departureAirportName: string;
  arrivalAirportName: string;
  departureDate: string;
  arrivalDate: string;
  duration: string;
  aircraftType: string;
  classP: string;
  classE: string;
  classB: string;
  cabinClassP: string;
  cabinClassE: string;
  cabinClassB: string;
  seatP: string;
  seatE: string;
  seatB: string;
  luggageP: string;
  luggageE: string;
  luggageB: string;
  routeNumber: string;
  companyCampaignDescription: string;
  isSeatCountFromService: string;
  isMealPaid: string;
  corridorCount: string;
  floorCount: string;
  seatDistance: string;
  id2: string;
  companyLogo: string;

  constructor(segment: FlightSegment) {
    this.id = segment.ID;
    this.optionId = segment.SecenekID;
    this.companyId = segment.FirmaID;
    this.companyLogo = `https://ws.biletall.com/HavaYoluLogo/orta/${segment.Firma}.png`;
    this.airlineCode = segment.Firma;
    this.airline = segment.FirmaAd;
    this.flightNumber = segment.SeferNo;
    this.companyFlightNumber = segment.FirmaSeferNo;
    this.flightCode = segment.SeferKod;
    this.departureAirport = segment.Kalkis;
    this.arrivalAirport = segment.Varis;
    this.departureCity = segment.KalkisSehir;
    this.arrivalCity = segment.VarisSehir;
    this.departureAirportName = segment.KalkisHavaalan;
    this.arrivalAirportName = segment.VarisHavaalan;
    this.departureDate = segment.KalkisTarih;
    this.arrivalDate = segment.VarisTarih;
    this.duration = segment.Sure;
    this.aircraftType = segment.UcakTip;
    this.classP = segment.SinifP;
    this.classE = segment.SinifE;
    this.classB = segment.SinifB;
    this.cabinClassP = segment.KabinSinifP;
    this.cabinClassE = segment.KabinSinifE;
    this.cabinClassB = segment.KabinSinifB;
    this.seatP = segment.KoltukP;
    this.seatE = segment.KoltukE;
    this.seatB = segment.KoltukB;
    this.luggageP = segment.BagajP;
    this.luggageE = segment.BagajE;
    this.luggageB = segment.BagajB;
    this.routeNumber = segment.RotaNo;
    this.companyCampaignDescription = segment.FirmaKampanyaAciklama;
    this.isSeatCountFromService = segment.KalanKoltukSayisiServistenMiGeliyor;
    this.isMealPaid = segment.YemekUcretliMi;
    this.corridorCount = segment.KoridorSayi;
    this.floorCount = segment.KatSayi;
    this.seatDistance = segment.KoltukMesafe;
    this.id2 = segment.SegmentID2;
  }
}

export class SegmentClassDto {
  segmentId2: string;
  optionFareId: string;
  classCode: string;
  seatCount: string;
  isSeatCountFromService: string;
  fee: string;
  missingSeat: string;

  constructor(segmentClass: SegmentClass) {
    this.segmentId2 = segmentClass.SegmentID2;
    this.optionFareId = segmentClass.SecenekUcretID;
    this.classCode = segmentClass.SinifKod;
    this.seatCount = segmentClass.KoltukSayi;
    this.isSeatCountFromService =
      segmentClass.KalanKoltukSayisiServistenMiGeliyor;
    this.fee = segmentClass.Ucret;
    this.missingSeat = segmentClass.EksikKoltukMu;
  }
}

export class OptionFareDto {
  id: string;
  optionId2: string;
  className: string;
  classType: string;
  seatCount: string;
  isSeatCountFromService: string;
  luggage: string;
  singlePassengerFee: string;
  singlePassengerServiceFee: string;
  totalFee: string;
  totalServiceFee: string;
  description: string;
  fareDetails: OptionFareDetailDto[];
  segmentClass?: SegmentClassDto;

  constructor(
    optionFare: OptionFare,
    optionFareDetails: OptionFareDetailDto[],
    segmentClass?: SegmentClassDto,
  ) {
    this.id = optionFare.ID;
    this.optionId2 = optionFare.SecenekID2;
    this.className = optionFare.SinifAd;
    this.classType = optionFare.SinifTip;
    this.seatCount = optionFare.KoltukSayi;
    this.isSeatCountFromService =
      optionFare.KalanKoltukSayisiServistenMiGeliyor;
    this.luggage = optionFare.Bagaj;
    this.singlePassengerFee = optionFare.TekYolcuUcret;
    this.singlePassengerServiceFee = optionFare.TekYolcuServisUcret;
    this.totalFee = optionFare.ToplamUcret;
    this.totalServiceFee = optionFare.ToplamServisUcret;
    this.description = optionFare.Aciklama;
    this.fareDetails = optionFareDetails;
    this.segmentClass = segmentClass;
  }
}

export class OptionFareDetailDto {
  id: string;
  optionFareId: string;
  type: string;
  description: string;

  constructor(optionFareDetail: OptionFareDetail) {
    this.id = optionFareDetail.ID;
    this.optionFareId = optionFareDetail.SecenekUcretID;
    this.type = optionFareDetail.Tip;
    this.description = optionFareDetail.Aciklama;
  }
}

export class DomesticFlightWithFares {
  flightOption: FlightOptionDto;
  segments: Array<
    DomesticFlightSegmentDto & {
      optionFares: OptionFareDto[];
    }
  >;
}

export class DomesticFlightScheduleDto {
  constructor(
    public departureFlightsWithFares: Array<DomesticFlightWithFares>,
    public returnFlightsWithFares: Array<DomesticFlightWithFares>,
  ) {}
}
