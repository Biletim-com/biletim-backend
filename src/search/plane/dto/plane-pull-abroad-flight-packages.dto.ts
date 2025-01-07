import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// dtos
import { FlightSegmentWithoutFareDetailsDto } from '@app/common/dtos';
import { PullPriceFlightRequestDto } from './plane-pull-price-flight.dto';
import { BrandFareInfoDto } from '@app/providers/ticket/biletall/plane/dto/plane-pull-abroad-flight-price-packages.dto';
import { PlaneTicketFeeManager } from '@app/common/utils';

class PullAbroadFlightPackagesSegmentDto extends FlightSegmentWithoutFareDetailsDto {
  @ApiProperty({
    description: 'Flight segment code (SeferKod).',
    example:
      'UHNIcU5GSkV1REtBVmFEN210QUFBQT09LDAsVkYsNDEsU0FXLE1VQywyMDI0LTA5LTMwVDEwOjEwOjAwLjAwMCswMzowMCwyMDI0LTA5LTMwVDEyOjA1OjAwLjAwMCswMjowMCxWLFZIVFNBSlJPLEEsRWNvbm9teSwwMDAxLDE1MTM3MTIsQkFTSUM=',
    required: true,
  })
  @IsString()
  @IsOptional()
  flightCode: string;
}

export class PullAbroadFlightPackagesRequestDto extends PullPriceFlightRequestDto {
  @ApiProperty({
    description: 'Unique operation ID for the request.',
    example: '62062f6a-3140-4843-bbdd-8161579842f6',
  })
  @IsNotEmpty()
  @IsString()
  operationId: string;

  @ApiProperty({
    description: 'Flight segment information for the flight.',
    type: [PullAbroadFlightPackagesSegmentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PullAbroadFlightPackagesSegmentDto)
  segments: PullAbroadFlightPackagesSegmentDto[];
}

export class PullAbroadFlightPackagesResponseDto {
  public readonly brandFareInfos: BrandFareInfoDto[];
  constructor(
    public readonly transactionId: string,
    public readonly currencyTypeCode: string,
    public readonly isSuccess: boolean,
    public readonly message: string,
    brandFareInfos: BrandFareInfoDto[],
  ) {
    this.brandFareInfos = this.addCommissionRate(brandFareInfos);
  }

  private addCommissionRate(brandFareInfos: BrandFareInfoDto[]) {
    const newBrandFareInfos = [...brandFareInfos];
    newBrandFareInfos.forEach((brandFareInfo) => {
      const {
        totalBasePrice,
        totalTaxPrice,
        totalServicePrice,
        totalMinimumServicePrice,
      } = brandFareInfo.brandPriceInfo;

      brandFareInfo.brandPriceInfo = {
        ...brandFareInfo.brandPriceInfo,
        totalPrice: PlaneTicketFeeManager.getTotalPriceWithFee(
          totalBasePrice,
          totalTaxPrice,
          Number(totalServicePrice) + Number(totalMinimumServicePrice),
        ).toString(),
        totalServicePrice: PlaneTicketFeeManager.getTotalServiceFee(
          totalBasePrice,
          totalTaxPrice,
          Number(totalServicePrice) + Number(totalMinimumServicePrice),
        ).toString(),
      };
    });
    return newBrandFareInfos;
  }
}
