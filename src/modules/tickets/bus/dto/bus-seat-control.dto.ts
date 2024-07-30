import { OmitType } from '@nestjs/swagger/dist/type-helpers/omit-type.helper';
import { BusSeatDto } from './bus-seat.dto';
import { BusSearchDto } from './bus-search.dto';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// check wether the passenger can buy the requested ticket based on their gender
export class BusSeatControlDto extends OmitType(BusSearchDto, [
  'passengerCount',
]) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusSeatDto)
  @IsNotEmpty()
  seats!: BusSeatDto[];

  constructor(partial: Partial<BusSeatControlDto>) {
    super(partial);
    Object.assign(this, partial);
    this.operationType = this.operationType ?? 0;
  }
}
