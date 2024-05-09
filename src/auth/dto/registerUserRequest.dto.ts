import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsStrongPassword,
  IsUUID,
  MinLength,
} from 'class-validator';

export class RegisterUserRequest {
  @ApiProperty({
    description: 'Email',
    example: 'email@test.com',
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
    example: 'password',
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

  @ApiProperty({
    description: 'Phome Number',
    example: '+90123456789',
  })
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    description: 'Address',
    example: 'Address',
  })
  address?: string;

  @ApiProperty({
    description: 'Is Admin',
    example: false,
  })
  @IsBoolean()
  isAdmin?: boolean;

  @ApiProperty({
    description: 'Company Id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  company_id!: string;
}
