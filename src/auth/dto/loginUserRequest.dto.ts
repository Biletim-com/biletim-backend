import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginUserRequest {
  @ApiProperty({
    description: 'Email',
    example: 'email@test.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Password',
    example: 'password',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password!: string;
}
