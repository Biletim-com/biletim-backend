import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class VerificationDto {
  @IsNotEmpty()
  @IsNumberString()
  @MinLength(6, { message: 'verificationCode must be 6 characters long.' })
  @MaxLength(6, { message: 'verificationCode must be 6 characters long.' })
  @ApiProperty({
    description: 'Verification code of the user',
    example: '123456',
  })
  verificationCode!: string;
}
