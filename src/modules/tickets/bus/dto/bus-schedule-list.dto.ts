import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// request to be sent to get the available dates
export class ScheduleListDto {
  @IsInt()
  @IsOptional()
  companyNo?: number;

  @IsInt()
  @IsNotEmpty()
  departurePointID!: number;

  @IsInt()
  @IsNotEmpty()
  arrivalPointID!: number;

  @IsDateString({}, { message: 'Date must be in the format yyyy-MM-dd' })
  @IsNotEmpty()
  date!: Date;

  @IsInt()
  @IsOptional()
  includeIntermediatePoints?: number;

  @IsInt()
  @IsOptional()
  operationType?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  passengerCount?: number;

  @IsNotEmpty()
  @IsString()
  ip!: string;

  constructor(partial: Partial<ScheduleListDto>) {
    Object.assign(this, partial);
    this.companyNo = this.companyNo ?? 0;
    this.includeIntermediatePoints = this.includeIntermediatePoints ?? 1;
    this.operationType = this.operationType ?? 0;
  }
}
