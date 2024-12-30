import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// dtos
import { FlightSegmentWithoutFareDetailsDto } from '@app/common/dtos';
import { PullPriceFlightRequestDto } from './plane-pull-price-flight.dto';

class PullAbroadFlightPricePackagesSegmentDto extends FlightSegmentWithoutFareDetailsDto {
  @ApiProperty({
    description: 'Flight segment code (SeferKod).',
    example:
      'UHNIcU5GSkV1REtBVmFEN210QUFBQT09LDAsVkYsNDEsU0FXLE1VQywyMDI0LTA5LTMwVDEwOjEwOjAwLjAwMCswMzowMCwyMDI0LTA5LTMwVDEyOjA1OjAwLjAwMCswMjowMCxWLFZIVFNBSlJPLEEsRWNvbm9teSwwMDAxLDE1MTM3MTIsQkFTSUM=',
    required: true,
  })
  @IsString()
  @IsOptional()
  flightCode: string;
}

export class PullAbroadFlightPricePackagesRequestDto extends PullPriceFlightRequestDto {
  @ApiProperty({
    description: 'Unique operation ID for the request.',
    example: '62062f6a-3140-4843-bbdd-8161579842f6',
  })
  @IsNotEmpty()
  @IsString()
  operationId: string;

  @ApiProperty({
    description: 'Flight segment information for the flight.',
    type: [PullAbroadFlightPricePackagesSegmentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PullAbroadFlightPricePackagesSegmentDto)
  segments: PullAbroadFlightPricePackagesSegmentDto[];
}
