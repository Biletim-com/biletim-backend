import { IsInt, IsOptional } from 'class-validator';

export class BusCompanyDto {
  @IsInt()
  @IsOptional()
  companyNo?: number;

  constructor(partial: Partial<BusCompanyDto>) {
    Object.assign(this, partial);
    this.companyNo = this.companyNo ?? 0;
  }
}
