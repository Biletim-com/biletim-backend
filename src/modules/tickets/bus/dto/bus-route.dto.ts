import { OmitType } from '@nestjs/swagger/dist/type-helpers/omit-type.helper';
import { IsNotEmpty, IsString } from 'class-validator';
import { BusScheduleRequestDto } from './bus-schedule-list.dto';
import { RouteDetail } from '../services/biletall/types/biletall-route.type';
import { ApiProperty } from '@nestjs/swagger';

export class BusRouteRequestDto extends OmitType(BusScheduleRequestDto, [
  'includeIntermediatePoints',
  'operationType',
  'ip',
  'companyNo',
]) {
  @ApiProperty({
    description: 'Company number, required for id the bus company.',
    example: '12345',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  companyNo?: string;

  @ApiProperty({
    description: 'Route number.',
    example: '3',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  routeNumber: string;

  @ApiProperty({
    description: 'Tracking number for the trip, used for tracking purposes.',
    example: '20454',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tripTrackingNumber: string;

  @ApiProperty({
    description: 'Information technology name.',
    example: 'GuzergahVerSaatli',
    required: true,
  })
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
