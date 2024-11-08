import {
  IsCreditCard,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { DateISODate } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBankCardDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsCreditCard()
  @Length(16, 16)
  pan: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  holderName: string;

  @ApiProperty({ required: true, example: 7 })
  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'Expiry month must be between 1 and 12.' })
  @Max(12, { message: 'Expiry month must be between 1 and 12.' })
  private readonly expiryMonth: number;

  @ApiProperty({ required: true, example: 2028 })
  @IsNotEmpty()
  @IsInt()
  @Min(new Date().getFullYear(), {
    message: 'Expiry year cannot be in the past.',
  })
  @Max(new Date().getFullYear() + 20, {
    message: 'Expiry year is too far in the future.',
  })
  private readonly expiryYear: number;

  get expiryDate(): DateISODate {
    const lastDate = new Date(this.expiryYear, this.expiryMonth, 0);

    const year = lastDate.getFullYear();
    const month = String(lastDate.getMonth() + 1).padStart(2, '0');
    const day = String(lastDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}` as DateISODate;
  }

  get maskedPan(): string {
    return `${this.pan.slice(0, 6)}${'*'.repeat(7)}${this.pan.slice(-2)}`;
  }
}
