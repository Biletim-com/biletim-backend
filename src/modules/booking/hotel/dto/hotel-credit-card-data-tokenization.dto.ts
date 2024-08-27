import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class CreditCardDataDto {
  @ApiProperty({
    description: 'Year (Required)',
    example: '24',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2)
  year!: string;

  @ApiProperty({
    description: 'Card Number (Required)',
    example: '4111111111111111',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(13)
  @MaxLength(19)
  card_number!: string;

  @ApiProperty({
    description: 'Card Holder (Required)',
    example: 'Test',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  card_holder!: string;

  @ApiProperty({
    description: 'Month (Required)',
    example: '03',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2)
  month!: string;
}

export class CreditCardDataTokenizationRequestDto {
  @ApiProperty({
    description:
      'Identifier of the booking order item made by the partner (identifier created at Emerging Travel Group) (Required)',
    example: 'order id',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  object_id!: string;

  pay_uuid!: string;

  init_uuid!: string;

  @ApiProperty({
    description: 'Guest first name (Required)',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  user_first_name!: string;

  @ApiProperty({
    description: 'Guest last name (Required)',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1)
  user_last_name!: string;

  @ApiProperty({
    description: 'CVC code.(Optional)',
    example: '123',
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  cvc?: string;

  @ApiProperty({
    description: 'Whether or not a CVC code is needed (Required)',
    example: true,
  })
  @IsBoolean()
  is_cvc_required!: boolean;

  @ApiProperty({
    description: 'Credit card data information (Required)',
  })
  @ValidateNested()
  @Type(() => CreditCardDataDto)
  @IsNotEmpty()
  credit_card_data_core!: CreditCardDataDto;
}
