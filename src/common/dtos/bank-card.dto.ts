import { DateISODate } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

// enums
import { BankCardType } from '../enums';

// utils
import { identifyBankCardType } from '../utils';

// decorators
import { IsBankCardNumber } from '../decorators';

export class BankCardDto {
  @ApiProperty({ required: true, minLength: 16, maxLength: 16 })
  @IsNotEmpty()
  @IsBankCardNumber()
  pan: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  holderName: string;

  @ApiProperty({ required: true, minLength: 3, maxLength: 4 })
  @IsNotEmpty()
  @IsNumberString({}, { message: 'CVV must be numeric.' })
  @Length(3, 4, { message: 'CVV must be 3 or 4 digits long.' })
  cvv: string;

  @ApiProperty({ required: true, minLength: 1, maxLength: 12 })
  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'Expiry month must be between 1 and 12.' })
  @Max(12, { message: 'Expiry month must be between 1 and 12.' })
  expiryMonth: number;

  @ApiProperty({ required: true, minLength: 4, maxLength: 4 })
  @IsNotEmpty()
  @IsInt()
  @Min(new Date().getFullYear(), {
    message: 'Expiry year cannot be in the past.',
  })
  @Max(new Date().getFullYear() + 20, {
    message: 'Expiry year is too far in the future.',
  })
  expiryYear: number;

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

  get cardType(): BankCardType {
    return identifyBankCardType(this.pan);
  }
}
