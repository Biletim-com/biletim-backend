import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { BankCardDto } from '@app/common/dtos';
import { UUID } from '@app/common/types';

export class PaymentMethodDto {
  @ApiProperty({
    description:
      'Flag indicating if the wallet should be used for the purchase',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  useWallet?: boolean;

  @ApiProperty({
    description: 'ID of the saved card to use for the purchase',
    required: false,
  })
  @ValidateIf((obj) => !obj.useWallet && !obj.bankCard)
  @IsString()
  @IsNotEmpty()
  savedCardId?: UUID;

  @ApiProperty({
    description: 'Bank card details for the purchase',
    type: BankCardDto,
    required: false,
  })
  @ValidateIf((obj) => !obj.useWallet && !obj.savedCardId)
  @ValidateNested()
  @Type(() => BankCardDto)
  bankCard?: BankCardDto;
}

export class PurchaseDto {
  @ApiProperty({
    description: 'Contact email address of the person booking the ticket',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Contact phone number of the person booking the ticket. Must be 10 characters',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Payment method (wallet, saved card, or direct bank card)',
    type: PaymentMethodDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto;
}
