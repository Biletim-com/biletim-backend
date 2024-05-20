import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class VerificationDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'verificationCode of the user',
    example: '123456',
  })
  verificationCode!: string;
}
