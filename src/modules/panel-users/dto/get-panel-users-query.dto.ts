import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetPanelUsersQuery {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsNumber()
  @IsOptional()
  offset?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
