import { IsNotEmpty, IsString } from 'class-validator';

export class PnrSearchRequestDto {
  @IsNotEmpty()
  @IsString()
  pnrNumber: string;

  @IsNotEmpty()
  @IsString()
  pnrSearcParameter: string;
}
