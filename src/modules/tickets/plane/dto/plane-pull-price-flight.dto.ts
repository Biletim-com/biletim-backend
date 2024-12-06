import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// dtos
import { FlightSegmentWithoutFareDetailsDto } from '@app/common/dtos';

export class PullPriceFlightRequestDto {
  @ApiProperty({
    description: 'The company number.',
    example: '1100',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  companyNumber: string;

  @ApiProperty({
    description: 'The list of flight segments.',
    type: [FlightSegmentWithoutFareDetailsDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightSegmentWithoutFareDetailsDto)
  segments: Array<FlightSegmentWithoutFareDetailsDto>;

  @ApiProperty({
    description: 'The number of adults.',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  adultCount?: number;

  @ApiProperty({
    description: 'The number of children.',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  childCount?: number;

  @ApiProperty({
    description: 'The number of babies.',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  babyCount?: number;

  @ApiProperty({
    description:
      'The number of students. Optional but applicable only for domestic flights.',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  studentCount?: number;

  @ApiProperty({
    description:
      'The number of seniors. Optional but applicable only for domestic flights.',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  elderlyCount?: number;

  @ApiProperty({
    description:
      'The number of military personnel. Optional but applicable only for domestic flights.',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  militaryCount?: number;

  @ApiProperty({
    description:
      'The number of youths. Optional but applicable only for domestic flights.',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  youthCount?: number;
}
