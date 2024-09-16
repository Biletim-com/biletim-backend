import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsCreditCard,
  Length,
  IsBoolean,
} from 'class-validator';

export class BusWebPassengerDto {
  @IsNotEmpty()
  @IsString()
  ip: string;

  @IsOptional()
  @IsString()
  @Matches(
    /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
  )
  email?: string;

  @IsNotEmpty()
  @IsCreditCard()
  creditCardNo: string;

  @IsNotEmpty()
  @IsString()
  creditCardHolder: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(0[0-1]|1[0-2])\/\d{4}$/, {
    message: 'creditCardExpiryDate must be in the format MM/YYYY',
  })
  creditCardExpiryDate: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 3, { message: 'creditCardCCV2 must be 3 digits' })
  creditCardCCV2: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value === true ? 1 : undefined), {
    toPlainOnly: true,
  })
  prepaymentUsage?: boolean;

  @IsNotEmpty()
  @IsString()
  prepaymentAmount: string;
}
