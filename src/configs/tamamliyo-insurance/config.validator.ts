import { IsString, IsNotEmpty } from 'class-validator';

export class TamamliyoApiEnvVarsValidation {
  @IsString()
  @IsNotEmpty()
  TAMAMLIYO_API_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  TAMAMLIYO_TOKEN: string;
}
