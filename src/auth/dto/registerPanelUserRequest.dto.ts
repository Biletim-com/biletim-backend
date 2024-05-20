import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsStrongPassword,
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
  name!: string;

  @ApiProperty({
    description: 'Family Name',
    example: 'Doe',
  })
  @IsNotEmpty()
  @MinLength(2)
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
  @IsNotEmpty()
  password!: string;
}
