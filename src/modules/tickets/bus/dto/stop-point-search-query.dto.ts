import { IsNotEmpty, IsString } from 'class-validator';

export class StopPointSearchQueryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
