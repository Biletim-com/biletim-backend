import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetUsersQuery {
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
