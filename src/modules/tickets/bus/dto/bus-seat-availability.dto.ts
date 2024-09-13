import { OmitType } from '@nestjs/swagger/dist/type-helpers/omit-type.helper';
import { Transform, Type } from 'class-transformer';
import { BusSearchRequestDto } from './bus-search.dto';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Gender } from '@app/common/enums/bus-seat-gender.enum';
import { ApiProperty } from '@nestjs/swagger';

class BusSeatDto {
  @ApiProperty({
    description: 'Seat number',
    example: '13',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  seatNumber: string;

  // male - 2
  // female - 1
  @ApiProperty({
    description: 'Passenger gender',
    example: 'male',
    required: true,
    enum: Gender,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  @Transform(({ value }) => {
    const genderStr = value.toString().toLowerCase().trim();

    if (genderStr === 'male') return Gender.MALE;
    if (genderStr === 'female') return Gender.FEMALE;

    return undefined;
  })
  gender: Gender;
}

// check wether the passenger can buy the requested ticket based on their gender
export class BusSeatAvailabilityRequestDto extends OmitType(
  BusSearchRequestDto,
  ['passengerCount'],
) {
  @ApiProperty({
    description: 'List of seat information',
    type: [BusSeatDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusSeatDto)
  @IsNotEmpty()
  seats: BusSeatDto[];

  constructor(partial: Partial<BusSeatAvailabilityRequestDto>) {
    super(partial);
    Object.assign(this, partial);
    this.operationType = this.operationType ?? 0;
  }
}

export class BusSeatAvailabilityDto {
  isAvailable: boolean;

  constructor(isAvailable: boolean) {
    this.isAvailable = isAvailable;
  }
}
