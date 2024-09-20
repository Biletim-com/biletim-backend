import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterUserRequest {
  @ApiProperty({
    description: 'Email',
    example: 'emre.yilmaz@westerops.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Name',
    example: 'Adam',
  })
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, {
    message: 'Ad alanı sadece harf içermelidir.',
  })
  name!: string;

  @ApiProperty({
    description: 'Family Name',
    example: 'Doe',
  })
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, {
    message: 'Soyad alanı sadece harf içermelidir.',
  })
  familyName!: string;

  @ApiProperty({
    description: 'Password',
    example: 'Test.1234',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
