import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @ApiProperty({
    description: 'email of user',
    example: 'john.doe@example.com',
  })
  email!: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID('4')
  @ApiProperty({
    description: 'verificationCode of the user',
    example: '42e72316-b830-40ed-9f1d-4a3d3b1efa31',
  })
  verificationCode!: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({
    description: 'New password of the user',
    example: 'Password.12345',
  })
  newPassword!: string;
}
