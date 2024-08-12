import { FlightClassType } from '@app/common/enums/plane-flight-class-type.enum';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PlaneDomesticFlightScheduleRequestDto } from './plane-domestic-flight-schedule.dto';
import {
  AbroadFlightOption,
  AbroadFlightSegment,
} from '../services/biletall/types/biletall-plane-abroad-flight-schedule.type';

export class PlaneAbroadFlightScheduleRequestDto extends PlaneDomesticFlightScheduleRequestDto {
  @IsOptional()
  @IsBoolean()
  splitSearch?: boolean;

  @IsBoolean()
  @IsOptional()
  splitSearchRoundTripGroup?: boolean;

  @IsOptional()
  @IsEnum(FlightClassType)
  classType?: FlightClassType;
}

export class AbroadFlightOptionDto {
  id: string;
  vPrice: string;
  nPrice: string;
  adultCount: string;
  childCount: string;
  infantCount: string;
  adultVPrice: string;
  childVPrice: string;
  infantVPrice: string;
  adultNPrice: string;
  childNPrice: string;
  infantNPrice: string;
  serviceFee: string;
  optionDate: string;
  isReservable: string;
  isCharterFlight: string;
  companyNo: string;

  constructor(option: AbroadFlightOption) {
    this.id = option.ID;
    this.vPrice = option.VFiyat;
    this.nPrice = option.NFiyat;
    this.adultCount = option.YetiskinSayi;
    this.childCount = option.CocukSayi;
    this.infantCount = option.BebekSayi;
    this.adultVPrice = option.YetiskinVFiyat;
    this.childVPrice = option.CocukVFiyat;
    this.infantVPrice = option.BebekVFiyat;
    this.adultNPrice = option.YetiskinNFiyat;
    this.childNPrice = option.CocukNFiyat;
    this.infantNPrice = option.BebekNFiyat;
    this.serviceFee = option.ServisUcreti;
    this.optionDate = option.OpsiyonTarihi;
    this.isReservable = option.RezervasyonYapilabilirMi;
    this.isCharterFlight = option.CharterSeferMi;
    this.companyNo = option.FirmaNo;
  }
}

export class AbroadFlightSegmentDto {
  id: string;
  optionId: string;
  flightId: string;
  transfer: string;
  flightNo: string;
  flightCode: string;
  airline: string;
  airlineCode: string;
  departureCode: string;
  departureCountryId: string;
  departureCountry: string;
  departureCity: string;
  departureAirport: string;
  arrivalCode: string;
  arrivalCountryId: string;
  arrivalCountry: string;
  arrivalCity: string;
  arrivalAirport: string;
  flightDuration: string;
  departureDate: string;
  arrivalDate: string;
  time: string;
  class: string;
  remainingSeatCount: string;

  constructor(segment: AbroadFlightSegment) {
    this.id = segment.ID;
    this.optionId = segment.SecenekID;
    this.flightId = segment.UcusID;
    this.transfer = segment.Aktarma;
    this.flightNo = segment.SeferNo;
    this.flightCode = segment.SeferKod;
    this.airline = segment.HavaYolu;
    this.airlineCode = segment.HavaYoluKod;
    this.departureCode = segment.KalkisKod;
    this.departureCountryId = segment.KalkisUlkeID;
    this.departureCountry = segment.KalkisUlke;
    this.departureCity = segment.KalkisSehir;
    this.departureAirport = segment.KalkisHavaAlani;
    this.arrivalCode = segment.VarisKod;
    this.arrivalCountryId = segment.VarisUlkeID;
    this.arrivalCountry = segment.VarisUlke;
    this.arrivalCity = segment.VarisSehir;
    this.arrivalAirport = segment.VarisHavaAlani;
    this.flightDuration = segment.UcusSuresi;
    this.departureDate = segment.KalkisTarih;
    this.arrivalDate = segment.VarisTarih;
    this.time = segment.Vakit;
    this.class = segment.Sinif;
    this.remainingSeatCount = segment.KalanKoltukSayi;
  }
}

export class AbroadFlightScheduleDto {
  constructor(
    public flightOptions: AbroadFlightOptionDto[],
    public flightSegments: AbroadFlightSegmentDto[],
    public returnFlightSegments?: AbroadFlightSegmentDto[],
  ) {}
}
