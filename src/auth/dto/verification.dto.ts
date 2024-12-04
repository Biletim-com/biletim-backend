import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  MinLength,
  MaxLength,
  IsEmail,
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

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  email!: string;
}


export class VerificationCodeDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  email!: string;
}