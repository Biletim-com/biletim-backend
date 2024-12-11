import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BankCardDto } from '@app/common/dtos';

export class CreateBankCardDto extends BankCardDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;
}
