import { OmitType } from '@nestjs/swagger/dist/type-helpers/omit-type.helper';
import { IsNotEmpty, IsString } from 'class-validator';
import { BusScheduleRequestDto } from './bus-schedule-list.dto';
import { RouteDetail } from '../services/biletall/types/biletall-route.type';

export class BusRouteRequestDto extends OmitType(BusScheduleRequestDto, [
  'includeIntermediatePoints',
  'operationType',
  'passengerCount',
  'ip',
]) {
  @IsString()
  @IsNotEmpty()
  routeNumber: string;

  @IsString()
  @IsNotEmpty()
  tripTrackingNumber: string;

  @IsString()
  @IsNotEmpty()
  infoTechnologyName: string;
}

export class BusRouteDetailDto {
  arrivalPlace: string;
  orderNumber: string;
  departureDateTime: string;
  arrivalDateTime: string;
  routePointID: string;
  routePointName: string;

  constructor(routeDetail: RouteDetail) {
    this.arrivalPlace = routeDetail.VarisYeri;
    this.orderNumber = routeDetail.SiraNo;
    this.departureDateTime = routeDetail.KalkisTarihSaat;
    this.arrivalDateTime = routeDetail.VarisTarihSaat;
    this.routePointID = routeDetail.KaraNoktaID;
    this.routePointName = routeDetail.KaraNoktaAd;
  }
}
