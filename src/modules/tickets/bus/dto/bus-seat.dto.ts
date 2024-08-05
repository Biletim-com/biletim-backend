import { BusSeatGender } from '@app/common/enums/bus-seat-gender.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class BusSeatDto {
  @IsString()
  @IsNotEmpty()
  seatNumber: string;

  // male - 2
  // female - 1
  @IsEnum(BusSeatGender)
  @IsNotEmpty()
  gender: BusSeatGender;
}
