import { OmitType } from '@nestjs/swagger/dist/type-helpers/omit-type.helper';
import { BusSearchRequestDto } from './bus-search.dto';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Gender } from '@app/common/enums/bus-seat-gender.enum';
import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInEnumKeys } from '@app/common/decorators';

class BusSeatDto {
  @ApiProperty({
    description: 'Seat number',
    example: '13',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  seatNumber: string;

  @ApiProperty({
    description: 'Gender of the passenger: MALE or FEMALE.',
    example: 'MALE',
    required: true,
  })
  @IsInEnumKeys(Gender, {
    message: 'Gender must be a valid key (FEMALE or MALE)',
  })
  @IsNotEmpty()
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
