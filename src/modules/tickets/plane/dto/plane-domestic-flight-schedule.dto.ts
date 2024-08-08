import { PlaneTravelType } from '@app/common/enums';
import { PlaneTicketOperationType } from '@app/common/enums/plane-ticket-operation-type.enum';
import { DateISODate } from '@app/common/types';
import { Expose, Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import * as dayjs from 'dayjs';
import {
  FlightOption,
  FlightSegment,
  OptionFare,
  OptionFareDetail,
  SegmentClass,
} from '../services/biletall/types/biletall-plane-domistic-flight-schedule.type';

export class PlaneDomesticFlightScheduleRequestDto {
  @IsString()
  @IsOptional()
  companyNo: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  departureAirport: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  arrivalAirport: string;

  @IsNotEmpty()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  @IsDateString({}, { message: 'Date must be in the format yyyy-MM-dd' })
  departureDate: DateISODate;

  @IsOptional()
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD'))
  @IsDateString({}, { message: 'Date must be in the format yyyy-MM-dd' })
  returnDate?: DateISODate;

  @Expose()
  @Transform(({ obj }) =>
    obj.returnDate ? PlaneTravelType.ROUNDTRIP : PlaneTravelType.ONEWAY,
  )
  @IsEnum(PlaneTravelType)
  travelType: PlaneTravelType;

  @IsEnum(PlaneTicketOperationType)
  operationType: PlaneTicketOperationType;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  adultCount: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  childCount = 0;

  @IsOptional()
  @IsInt()
  @Min(0)
  babyCount = 0;

  @IsNotEmpty()
  @IsString()
  ip: string;
}

export class FlightOptionDto {
  id?: string;
  priceP?: string;
  priceE?: string;
  priceB?: string;
  luggageP?: string;
  luggageE?: string;
  luggageB?: string;
  time?: string;
  companyNo?: string;

  constructor(option: FlightOption) {
    this.id = option.ID;
    this.priceP = option.FiyatP;
    this.priceE = option.FiyatE;
    this.priceB = option.FiyatB;
    this.luggageP = option.BagajP;
    this.luggageE = option.BagajE;
    this.luggageB = option.BagajB;
    this.time = option.Vakit;
    this.companyNo = option.FirmaNo;
  }
}

export class FlightSegmentDto {
  id?: string;
  optionId?: string;
  company?: string;
  companyName?: string;
  flightNo?: string;
  flightCode?: string;
  departure?: string;
  arrival?: string;
  departureCity?: string;
  arrivalCity?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  departureDate?: string;
  arrivalDate?: string;
  duration?: string;
  aircraftType?: string;
  classP?: string;
  classE?: string;
  classB?: string;
  seatP?: string;
  seatE?: string;
  seatB?: string;
  luggageP?: string;
  luggageE?: string;
  luggageB?: string;

  constructor(segment: FlightSegment) {
    this.id = segment.ID;
    this.optionId = segment.SecenekID;
    this.company = segment.Firma;
    this.companyName = segment.FirmaAd;
    this.flightNo = segment.SeferNo;
    this.flightCode = segment.SeferKod;
    this.departure = segment.Kalkis;
    this.arrival = segment.Varis;
    this.departureCity = segment.KalkisSehir;
    this.arrivalCity = segment.VarisSehir;
    this.departureAirport = segment.KalkisHavaAlan;
    this.arrivalAirport = segment.VarisHavaAlan;
    this.departureDate = segment.KalkisTarih;
    this.arrivalDate = segment.VarisTarih;
    this.duration = segment.Sure;
    this.aircraftType = segment.UcakTip;
    this.classP = segment.SinifP;
    this.classE = segment.SinifE;
    this.classB = segment.SinifB;
    this.seatP = segment.KoltukP;
    this.seatE = segment.KoltukE;
    this.seatB = segment.KoltukB;
    this.luggageP = segment.BagajP;
    this.luggageE = segment.BagajE;
    this.luggageB = segment.BagajB;
  }
}

export class SegmentClassDto {
  segmentId?: string;
  optionFeeId?: string;
  classCode?: string;
  seatCount?: string;
  fee?: string;
  missingSeat?: string;

  constructor(segmentClass: SegmentClass) {
    this.segmentId = segmentClass.SegmentID2;
    this.optionFeeId = segmentClass.SecenekUcretID;
    this.classCode = segmentClass.SinifKod;
    this.seatCount = segmentClass.KoltukSayi;
    this.fee = segmentClass.Ucret;
    this.missingSeat = segmentClass.EksikKoltukMu;
  }
}

export class OptionFareDto {
  id?: string;
  optionId2?: string;
  className?: string;
  classType?: string;
  seatCount?: string;
  luggage?: string;
  singlePassengerFee?: string;
  singlePassengerServiceFee?: string;
  totalFee?: string;
  totalServiceFee?: string;
  description?: string;

  constructor(optionFare: OptionFare) {
    this.id = optionFare.ID;
    this.optionId2 = optionFare.SecenekID2;
    this.className = optionFare.SinifAd;
    this.classType = optionFare.SinifTip;
    this.seatCount = optionFare.KoltukSayi;
    this.luggage = optionFare.Bagaj;
    this.singlePassengerFee = optionFare.TekYolcuUcret;
    this.singlePassengerServiceFee = optionFare.TekYolcuServisUcret;
    this.totalFee = optionFare.ToplamUcret;
    this.totalServiceFee = optionFare.ToplamServisUcret;
    this.description = optionFare.Aciklama;
  }
}

export class OptionFareDetailDto {
  id?: string;
  optionFeeId?: string;
  type?: string;
  description?: string;

  constructor(optionFareDetail: OptionFareDetail) {
    this.id = optionFareDetail.ID;
    this.optionFeeId = optionFareDetail.SecenekUcretID;
    this.type = optionFareDetail.Tip;
    this.description = optionFareDetail.Aciklama;
  }
}

export class DomesticFlightScheduleDto {
  constructor(
    public flightOption: FlightOptionDto[],
    public flightSegment: FlightSegmentDto[],
    public segmentClass: SegmentClassDto[],
    public optionFare: OptionFareDto[],
    public optionFareDetail: OptionFareDetailDto[],
    public returnFlightOptions?: FlightOptionDto[],
    public returnFlightSegments?: FlightSegmentDto[],
  ) {}
}
