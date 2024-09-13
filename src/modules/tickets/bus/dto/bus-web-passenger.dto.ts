import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'IP address of the web passenger.',
    example: '127.0.0.1',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  ip: string;

  @ApiProperty({
    description:
      'Email address of the web passenger, must be a valid email format.',
    example: 'emre.yilmaz@westerops.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
  )
  email?: string;

  @ApiProperty({
    description: 'Credit card number of the web passenger.',
    example: '4111111111111111',
    required: true,
  })
  @IsNotEmpty()
  @IsCreditCard()
  creditCardNo: string;

  @ApiProperty({
    description: 'Credit card holder name.',
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  creditCardHolder: string;

  @ApiProperty({
    description: 'Credit card expiry date in the format MM/YYYY.',
    example: '12/2024',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(0[0-1]|1[0-2])\/\d{4}$/, {
    message: 'creditCardExpiryDate must be in the format MM/YYYY',
  })
  creditCardExpiryDate: string;

  @ApiProperty({
    description: 'Credit card CCV2, which must be 3 digits.',
    example: '123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3, { message: 'creditCardCCV2 must be 3 digits' })
  creditCardCCV2: string;

  @ApiProperty({
    description: 'Indicates whether prepayment usage is enabled.',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => (value === true ? 1 : undefined), {
    toPlainOnly: true,
  })
  prepaymentUsage?: boolean;

  @ApiProperty({
    description: 'Amount for prepayment.',
    example: '100.00',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  prepaymentAmount: string;
}
