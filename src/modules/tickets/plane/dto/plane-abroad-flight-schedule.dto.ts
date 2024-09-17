import { FlightClassType } from '@app/common/enums/plane-flight-class-type.enum';
import { IsBoolean, IsOptional } from 'class-validator';
import { PlaneDomesticFlightScheduleRequestDto } from './plane-domestic-flight-schedule.dto';
import {
  AbroadFlightOption,
  AbroadFlightSegment,
} from '../services/biletall/types/biletall-plane-abroad-flight-schedule.type';
import { IsInEnumKeys } from '@app/common/decorators';

export class PlaneAbroadFlightScheduleRequestDto extends PlaneDomesticFlightScheduleRequestDto {
  @IsOptional()
  @IsBoolean()
  splitSearch?: boolean;

  @IsBoolean()
  @IsOptional()
  splitSearchRoundTripGroup?: boolean;

  @IsOptional()
  @IsInEnumKeys(
    FlightClassType,
    {
      message: 'Flight class must be a valid enum key (ECONOMY, BUSINESS)',
    },
    true,
  )
  classType?: FlightClassType;
}

export class AbroadFlightOptionDto {
  id: string;
  vPrice: string;
  nPrice: string;
  adultCount: string;
  childCount: string;
  babyCount: string;
  adultVPrice: string;
  childVPrice: string;
  babyVPrice: string;
  adultNPrice: string;
  childNPrice: string;
  babyNPrice: string;
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
    this.babyCount = option.BebekSayi;
    this.adultVPrice = option.YetiskinVFiyat;
    this.childVPrice = option.CocukVFiyat;
    this.babyVPrice = option.BebekVFiyat;
    this.adultNPrice = option.YetiskinNFiyat;
    this.childNPrice = option.CocukNFiyat;
    this.babyNPrice = option.BebekNFiyat;
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
  departureAirport: string;
  departureCountryId: string;
  departureCountry: string;
  departureCity: string;
  departureAirportName: string;
  arrivalAirport: string;
  arrivalCountryId: string;
  arrivalCountry: string;
  arrivalCity: string;
  arrivalAirportName: string;
  flightDuration: string;
  departureDate: string;
  arrivalDate: string;
  time: string;
  classType: string;
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
    this.departureAirport = segment.KalkisKod;
    this.departureCountryId = segment.KalkisUlkeID;
    this.departureCountry = segment.KalkisUlke;
    this.departureCity = segment.KalkisSehir;
    this.departureAirportName = segment.KalkisHavaAlani;
    this.arrivalAirport = segment.VarisKod;
    this.arrivalCountryId = segment.VarisUlkeID;
    this.arrivalCountry = segment.VarisUlke;
    this.arrivalCity = segment.VarisSehir;
    this.arrivalAirportName = segment.VarisHavaAlani;
    this.flightDuration = segment.UcusSuresi;
    this.departureDate = segment.KalkisTarih;
    this.arrivalDate = segment.VarisTarih;
    this.time = segment.Vakit;
    this.classType = segment.Sinif;
    this.remainingSeatCount = segment.KalanKoltukSayi;
  }
}

export class AbroadFlightScheduleDto {
  constructor(
    public groupedFlight: Array<{
      flightId: string;
      segments: AbroadFlightSegmentDto[];
      flightOption: AbroadFlightOptionDto | undefined;
    }>,
    public groupedReturnFlight: Array<{
      flightId: string;
      segments: AbroadFlightSegmentDto[];
      flightOption: AbroadFlightOptionDto | undefined;
    }> = [],
  ) {}
}
