import { BusSeatGender } from '@app/common/enums/bus-seat-gender.enum';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export class BusSeatDto {
  @IsInt()
  @IsNotEmpty()
  seatNumber!: number;

  // male - 2
  // female - 1
  @IsEnum(BusSeatGender)
  @IsNotEmpty()
  gender!: BusSeatGender;
}
