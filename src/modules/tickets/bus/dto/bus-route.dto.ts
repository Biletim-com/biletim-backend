import { OmitType } from '@nestjs/swagger/dist/type-helpers/omit-type.helper';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ScheduleListDto } from './bus-schedule-list.dto';

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
