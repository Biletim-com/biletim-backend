// info regarding the bus

import {} from '@app/common/types/datetime.type';
import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ScheduleListDto } from './bus-schedule-list.dto';
import { OmitType } from '@nestjs/swagger/dist/type-helpers/omit-type.helper';

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
