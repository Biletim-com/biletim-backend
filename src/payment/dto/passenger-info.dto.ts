import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

// decorators
import { IsTCNumber } from '../../common/decorators';

// enums
import { Gender } from '../../common/enums';

// dtos
import { PassportDto } from './passport.dto';

export class PassengerInfoDto {
  @ApiProperty({
    description: 'The first name of the passenger.',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the passenger.',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Gender of the passenger.',
    required: true,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    description:
      'The Turkish ID number of the passenger. Must be 11 characters length.',
    example: '12345678901',
    required: false,
  })
  @IsNotEmpty()
  @ValidateIf((o) => !o.passport)
  @IsTCNumber()
  tcNumber?: string;

  @ApiProperty({
    description: 'The passport of the passenger.',
    required: false,
  })
  @IsNotEmpty()
  @ValidateNested()
  @ValidateIf((o) => !o.tcNumber)
  @Type(() => PassportDto)
  passport?: PassportDto;
}
