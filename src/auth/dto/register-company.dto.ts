import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterCompanyDto {
  @ApiProperty({
    description: 'Name',
    example: 'Acme Corp',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Description',
    example: 'Acme Corp',
  })
  description?: string;

  @ApiProperty({
    description: 'Address',
    example: 'Acme Corp',
  })
  address?: string;

  @ApiProperty({
    description: 'Phone',
    example: '+90123456789',
  })
  phone?: string;

  @ApiProperty({
    description: 'Domain',
    example: 'acme.com',
  })
  domain?: string;

  @ApiProperty({
    description: 'Website',
    example: 'https://acme.com',
  })
  website?: string;

  @ApiProperty({
    description: 'Logo',
    example: 'https://acme.com/logo.png',
  })
  logo?: string;
}
