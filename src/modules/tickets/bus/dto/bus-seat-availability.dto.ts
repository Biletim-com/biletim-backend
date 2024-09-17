import { OmitType } from '@nestjs/swagger/dist/type-helpers/omit-type.helper';
import { BusSearchRequestDto } from './bus-search.dto';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Gender } from '@app/common/enums/bus-seat-gender.enum';

import { Type } from 'class-transformer';
import { IsInEnumKeys } from '@app/common/decorators';

class BusSeatDto {
  @IsString()
  @IsNotEmpty()
  seatNumber: string;

  // male - 2
  // female - 1
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
