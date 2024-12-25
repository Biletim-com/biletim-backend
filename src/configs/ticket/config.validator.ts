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
}
