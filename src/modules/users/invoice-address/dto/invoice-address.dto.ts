import { InvoiceType } from '@app/common/enums';

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, ValidateIf, IsString } from 'class-validator';

export class InvoiceAddressDto {
  @ApiProperty({
    description: 'The type of invoice, such as individual or corporate',
    example: InvoiceType.INDIVIDUAL,
    enum: InvoiceType,
  })
  @IsEnum(InvoiceType)
  @IsNotEmpty()
  type: InvoiceType;

  @ApiProperty({
    description: 'The full name of person or company',
    example: 'John Doe || Westerops',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description:
      'Unique identifier for the invoice address (TC Number or Tax Number)',
    example: '12345678901',
  })
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'Address of the invoice owner',
    example: 'somewhere in the world',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Tax office associated with the invoice address',
    example: 'Downtown Tax Office',
  })
  @ValidateIf((dto) => dto.type === InvoiceType.CORPORATE)
  @IsNotEmpty()
  @IsString()
  taxOffice?: string;
}
