import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsOptional,
} from 'class-validator';
// enumns
import { OrderReturnRequestDto } from './order-return-request.dto';

export class OrderReturnFinishRequestDto extends OrderReturnRequestDto {
  @ApiProperty({
    description: 'The Verification Code',
    example: '123456',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(100000)
  @Max(999999)
  verificationCode: number;

  @ApiProperty({
    description: 'Define whether return is to wallet or not',
    required: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  returnToWallet: boolean;
}
