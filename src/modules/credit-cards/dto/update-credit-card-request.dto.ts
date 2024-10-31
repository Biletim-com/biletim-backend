import {
  IsCreditCard,
  IsInt,
  IsNotIn,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { DateISODate } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCreditCardDto {
  @ApiProperty()
  @IsNotIn([null])
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNotIn([null])
  @IsOptional()
  @IsCreditCard()
  pan?: string;

  @ApiProperty()
  @IsNotIn([null])
  @IsString()
  @IsOptional()
  holderName?: string;

  @ApiProperty({ minLength: 1, maxLength: 12 })
  @IsNotIn([null])
  @IsInt()
  @IsOptional()
  @Min(1, { message: 'Expiry month must be between 1 and 12.' })
  @Max(12, { message: 'Expiry month must be between 1 and 12.' })
  @ValidateIf((object) => object.expiryYear)
  private readonly expiryMonth?: number;

  @ApiProperty()
  @IsNotIn([null])
  @IsInt()
  @IsOptional()
  @Min(new Date().getFullYear(), {
    message: 'Expiry year cannot be in the past.',
  })
  @Max(new Date().getFullYear() + 20, {
    message: 'Expiry year is too far in the future.',
  })
  @ValidateIf((object) => object.expiryMonth)
  private readonly expiryYear?: number;

  get expiryDate(): DateISODate | undefined {
    if (this.expiryYear && this.expiryMonth) {
      const lastDate = new Date(this.expiryYear, this.expiryMonth, 0);

      const year = lastDate.getFullYear();
      const month = String(lastDate.getMonth() + 1).padStart(2, '0');
      const day = String(lastDate.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}` as DateISODate;
    }
    return undefined;
  }

  get maskedPan(): string | undefined {
    if (this.pan) {
      return `${this.pan.slice(0, 6)}${'*'.repeat(7)}${this.pan.slice(-2)}`;
    }
    return undefined;
  }
}
