import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class TicketEnvVarsValidation {
  @IsString()
  @IsNotEmpty()
  BILETALL_BASE_URI: string;

  @IsString()
  @IsNotEmpty()
  BILETALL_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  BILETALL_PASSWORD: string;

  @IsString()
  @IsOptional()
  BILETALL_EXTRA_BASE_URI?: string;

  @IsString()
  @IsOptional()
  BILETALL_EXTRA_USERNAME?: string;

  @IsString()
  @IsOptional()
  BILETALL_EXTRA_PASSWORD?: string;
}
