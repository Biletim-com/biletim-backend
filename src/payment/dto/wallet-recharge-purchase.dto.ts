import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';

import { PaymentMethodDto } from './purchase.dto';

class PaymentMethodForWalletRechargeDto extends OmitType(PaymentMethodDto, [
  'useWallet',
] as const) {}

export class WalletRechargePurchaseDto {
  @ApiProperty({
    description: 'Unique id of the rate',
    example: '100.10',
    required: true,
  })
  @IsNotEmpty()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'rechargeAmount must be a float with up to 2 decimal places',
  })
  rechargeAmount: string;

  @ApiProperty({
    description: 'Payment method (saved card or direct bank card)',
    type: PaymentMethodForWalletRechargeDto,
    required: true,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaymentMethodForWalletRechargeDto)
  paymentMethod: PaymentMethodForWalletRechargeDto;
}
