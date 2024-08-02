import { OmitType } from '@nestjs/swagger/dist/type-helpers/omit-type.helper';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ScheduleListDto } from './bus-schedule-list.dto';
import { RouteDetail } from '../services/biletall/types/biletall-route.type';

export class BusRouteDto extends OmitType(ScheduleListDto, [
  'includeIntermediatePoints',
  'operationType',
  'passengerCount',
  'ip',
]) {
  @IsInt()
  @IsNotEmpty()
  routeNumber!: number;

  @IsString()
  @IsNotEmpty()
  tripTrackingNumber?: string;

  @IsString()
  @IsNotEmpty()
  infoTechnologyName!: string;
}

export class RouteDetailResponseDto {
  ArrivalPlace: string;
  OrderNumber: string;
  DepartureDateTime: string;
  ArrivalDateTime: string;
  RoutePointID: string;
  RoutePointName: string;

  constructor(routeDetail: RouteDetail) {
    this.ArrivalPlace = routeDetail.VarisYeri;
    this.OrderNumber = routeDetail.SiraNo;
    this.DepartureDateTime = routeDetail.KalkisTarihSaat;
    this.ArrivalDateTime = routeDetail.VarisTarihSaat;
    this.RoutePointID = routeDetail.KaraNoktaID;
    this.RoutePointName = routeDetail.KaraNoktaAd;
  }

  static finalVersionRouteDetailResponse(
    routeDetails: RouteDetail[],
  ): RouteDetailResponseDto[] {
    return routeDetails.map(
      (routeDetail) => new RouteDetailResponseDto(routeDetail),
    );
  }
}
