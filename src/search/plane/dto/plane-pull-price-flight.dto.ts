import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// dtos
import { FlightSegmentWithoutFareDetailsDto } from '@app/common/dtos';
import {
  PlaneAdditionalServiceRuleDto,
  PlaneBaggageInfoDto,
  PlanePaymentRulesDto,
  PriceListDto,
} from '@app/providers/ticket/biletall/plane/dto/plane-pull-price-flight.dto';

// utils
import { PlaneTicketFeeManager } from '@app/common/utils';

export class PullPriceFlightRequestDto {
  @ApiProperty({
    description: 'The company number.',
    example: '1100',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  companyNumber: string;

  @ApiProperty({
    description: 'The list of flight segments.',
    type: [FlightSegmentWithoutFareDetailsDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightSegmentWithoutFareDetailsDto)
  segments: Array<FlightSegmentWithoutFareDetailsDto>;

  @ApiProperty({
    description: 'The number of adults.',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  adultCount?: number;

  @ApiProperty({
    description: 'The number of children.',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  childCount?: number;

  @ApiProperty({
    description: 'The number of babies.',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  babyCount?: number;

  @ApiProperty({
    description:
      'The number of students. Optional but applicable only for domestic flights.',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  studentCount?: number;

  @ApiProperty({
    description:
      'The number of seniors. Optional but applicable only for domestic flights.',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  elderlyCount?: number;

  @ApiProperty({
    description:
      'The number of military personnel. Optional but applicable only for domestic flights.',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  militaryCount?: number;

  @ApiProperty({
    description:
      'The number of youths. Optional but applicable only for domestic flights.',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  youthCount?: number;
}

export class PullPriceFlightResponseDto {
  priceList: PriceListDto;

  constructor(
    priceListResponse: PriceListDto,
    public paymentRules: PlanePaymentRulesDto,
    public baggageInfo?: PlaneBaggageInfoDto[],
    public additionalServiceRules?: PlaneAdditionalServiceRuleDto[],
  ) {
    const newTotalFee = PlaneTicketFeeManager.getTotalPriceWithFee(
      priceListResponse.totalNetTicketPrice,
      priceListResponse.totalTax,
      priceListResponse.totalServiceFee,
    );
    const newTotalServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.totalNetTicketPrice,
      priceListResponse.totalTax,
      priceListResponse.totalServiceFee,
    );
    const newAdultServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.adultNetPrice,
      priceListResponse.adultTax,
      priceListResponse.adultServiceFee,
    );
    const newChildServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.childNetPrice,
      priceListResponse.childTax,
      priceListResponse.childServiceFee,
    );
    const newBabyServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.babyNetPrice,
      priceListResponse.babyTax,
      priceListResponse.babyServiceFee,
    );
    const newElderlyMinServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.elderlyNetPrice,
      priceListResponse.elderlyTax,
      priceListResponse.elderlyServiceFee,
    );
    const newStudentServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.studentNetPrice,
      priceListResponse.studentTax,
      priceListResponse.studentServiceFee,
    );
    const newDisabledServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.disabledNetPrice,
      priceListResponse.disabledTax,
      priceListResponse.disabledServiceFee,
    );
    const newMilitaryServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.militaryNetPrice,
      priceListResponse.militaryTax,
      priceListResponse.militaryServiceFee,
    );
    const newYouthServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.youthNetPrice,
      priceListResponse.youthTax,
      priceListResponse.youthServiceFee,
    );
    const newTeacherServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.teacherNetPrice,
      priceListResponse.teacherTax,
      priceListResponse.teacherServiceFee,
    );
    const newPressServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.pressNetPrice,
      priceListResponse.pressTax,
      priceListResponse.pressServiceFee,
    );
    const newVeteranServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.veteranNetPrice,
      priceListResponse.veteranTax,
      priceListResponse.veteranServiceFee,
    );
    const newVehicleDriverServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.vehicleDriverNetPrice,
      priceListResponse.vehicleDriverTax,
      priceListResponse.vehicleDriverServiceFee,
    );
    const newAdditionalChildServiceFee =
      PlaneTicketFeeManager.getTotalServiceFee(
        priceListResponse.additionalChildNetPrice,
        priceListResponse.additionalChildTax,
        priceListResponse.additionalChildServiceFee,
      );
    const newDiscountedServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.discountedNetPrice,
      priceListResponse.discountedTax,
      priceListResponse.discountedServiceFee,
    );

    priceListResponse.totalTicketPrice = newTotalFee.toString();
    priceListResponse.totalServiceFee = newTotalServiceFee.toString();
    priceListResponse.adultServiceFee = newAdultServiceFee.toString();
    priceListResponse.childServiceFee = newChildServiceFee.toString();
    priceListResponse.babyServiceFee = newBabyServiceFee.toString();
    priceListResponse.elderlyMinServiceFee = newElderlyMinServiceFee.toString();
    priceListResponse.studentServiceFee = newStudentServiceFee.toString();
    priceListResponse.disabledServiceFee = newDisabledServiceFee.toString();
    priceListResponse.militaryServiceFee = newMilitaryServiceFee.toString();
    priceListResponse.youthServiceFee = newYouthServiceFee.toString();
    priceListResponse.teacherServiceFee = newTeacherServiceFee.toString();
    priceListResponse.pressServiceFee = newPressServiceFee.toString();
    priceListResponse.veteranServiceFee = newVeteranServiceFee.toString();
    priceListResponse.vehicleDriverServiceFee =
      newVehicleDriverServiceFee.toString();
    priceListResponse.additionalChildServiceFee =
      newAdditionalChildServiceFee.toString();
    priceListResponse.discountedServiceFee = newDiscountedServiceFee.toString();
    this.priceList = priceListResponse;
  }
}
