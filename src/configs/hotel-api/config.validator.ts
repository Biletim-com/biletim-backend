import { IsString, IsNotEmpty } from 'class-validator';

export class HotelApiEnvVarsValidation {
  @IsString()
  @IsNotEmpty()
  HOTEL_API_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  HOTEL_WS_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  HOTEL_WS_PASSWORD: string;
}
