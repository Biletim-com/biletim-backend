import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';

export class CreatePanelAdminDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, {
    message: 'Ad alanı sadece harf içermelidir.',
  })
  @ApiProperty({
    description: 'name of user',
    example: 'John',
  })
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, {
    message: 'Soyad alanı sadece harf içermelidir.',
  })
  @ApiProperty({
    description: 'surname of user',
    example: 'Doe',
  })
  familyName!: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  @IsString()
  @ApiProperty({
    description: 'email of user',
    example: 'john.doe@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'password',
    example: 'Test.1234',
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password!: string;
}
