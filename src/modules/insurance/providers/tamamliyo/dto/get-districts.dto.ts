import { IsNotEmpty, IsNumberString } from 'class-validator';
import { District, GetDistrictsResponse } from '../types/get-districts.type';
import { ApiProperty } from '@nestjs/swagger';

export class DistrictsRequestDto {
  @ApiProperty({
    description: 'City number (required)',
    example: 34,
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  cityId: number;
}

export class DistrictsDto {
  districtId: number;
  districtName: string;

  constructor(data: District) {
    this.districtId = data.ilceId;
    this.districtName = data.ilceAdi;
  }
}

export class GetDistrictsResponseDto {
  success: boolean;
  data: DistrictsDto[];

  constructor(response: GetDistrictsResponse) {
    this.success = response.success;
    this.data = response.data.map((distric) => new DistrictsDto(distric));
  }
}
