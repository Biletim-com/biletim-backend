import { OAuth2Provider } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class LoginOAuth2Dto {
  @ApiProperty({
    description: 'The OAuth2 provider (e.g., google or facebook)',
    example: 'google',
  })
  @IsString()
  provider: OAuth2Provider;

  @ApiProperty({
    description: 'The authorization code received from the provider',
  })
  @IsString()
  @Transform(({ value }) => decodeURIComponent(value))
  code: string;

  @ApiProperty({
    description: 'The redirect URI used during the OAuth2 flow',
  })
  @IsString()
  redirectUri: string;
}
