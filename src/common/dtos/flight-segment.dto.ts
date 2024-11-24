import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsDateString,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';

export class FlightSegmentFareDetailsDto {
  @ApiProperty({
    description: 'Cabin lagguage description',
    example: '1 parça x 8 kg kabin bagajı',
    required: false,
  })
  @IsOptional()
  @IsString()
  cabinLuggage?: Nullable<string>;

  @ApiProperty({
    description: 'Lagguage description',
    example: '15 kg bagaj',
    required: false,
  })
  @IsOptional()
  @IsString()
  luggage?: Nullable<string>;

  @ApiProperty({
    description: 'The travel class name.',
    example: 'Eco Fly',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  flightClassName: string;

  @ApiProperty({
    description: 'The travel class type.',
    example: 'Ekonomi',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  flightClassType: string;
}

export class FlightSegmentDto {
  @ApiProperty({
    description: 'Three-letter code of the departure airport.',
    example: 'IST',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  departureAirport: string;

  @ApiProperty({
    description: 'Three-letter code of the  arrival airport.',
    example: 'ATH',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  arrivalAirport: string;

  @ApiProperty({
    description: 'The departure date and time in ISO 8601 format.',
    example: '2024-12-01T15:30:00Z',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  departureDateTime: string;

  @ApiProperty({
    description: 'The arrival date and time in ISO 8601 format.',
    example: '2024-12-01T18:30:00Z',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  arrivalDateTime: string;

  @ApiProperty({
    description: 'The flight number.',
    example: '999',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  flightNumber: string;

  @ApiProperty({
    description: 'An optional code associated with the flight.',
    example:
      'VG5iNGNIVnFXREtBTFVsTEVBQUFBQT09LDAsQTMsOTk5LElTVCxBVEgsMjAyNC0wOS0xNVQwNTozMDowMC4wMDArMDM6MDAsMjAyNC0wOS0xNVQwNzowMDowMC4wMDArMDM6MDAsUCxQSEZMWFNELEEsRWNvbm9teSwwMDAzLDE1MTc0MTUsRkxFWA==',
    required: false,
  })
  @IsOptional()
  @IsString()
  flightCode?: string;

  @ApiProperty({
    description: 'The travel class.',
    example: 'TE',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  flightClassCode: string;

  @ApiProperty({
    description: 'Flight segment fare details.',
    type: FlightSegmentFareDetailsDto,
  })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => FlightSegmentFareDetailsDto)
  flightFareDetails: FlightSegmentFareDetailsDto;

  @ApiProperty({
    description: 'The airline code.',
    example: 'A3',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  airlineCode: string;

  @ApiProperty({
    description: 'Indicates whether this is a return segment.',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isReturnFlight: boolean;
}
