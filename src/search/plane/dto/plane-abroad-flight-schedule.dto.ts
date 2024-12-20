import { FlightClassType } from '@app/common/enums';
import { IsBoolean, IsOptional } from 'class-validator';
import { IsInEnumKeys } from '@app/common/decorators';
import { ApiProperty } from '@nestjs/swagger';

import { PlaneDomesticFlightScheduleRequestDto } from './plane-domestic-flight-schedule.dto';

export class PlaneAbroadFlightScheduleRequestDto extends PlaneDomesticFlightScheduleRequestDto {
  @ApiProperty({
    description: 'Indicates whether to split the search results.',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  splitSearch?: boolean;

  @ApiProperty({
    description:
      'Indicates whether to split the search results for round trips.',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  splitSearchRoundTripGroup?: boolean;

  @ApiProperty({
    description: `The class type of the flight. If no class type is specified, all class types will be included in the search results.`,
    example: 'ECONOMY',
    required: false,
  })
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
