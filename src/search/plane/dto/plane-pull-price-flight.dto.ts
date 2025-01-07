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
    priceList: PriceListDto,
    public readonly paymentRules: PlanePaymentRulesDto,
    public readonly baggageInfo?: PlaneBaggageInfoDto[],
    public readonly additionalServiceRules?: PlaneAdditionalServiceRuleDto[],
  ) {
    const priceListResponse = { ...priceList };
    const newTotalFee = PlaneTicketFeeManager.getTotalPriceWithFee(
      priceListResponse.totalNetTicketPrice,
      priceListResponse.totalTax,
      Number(priceListResponse.totalServiceFee) +
        Number(priceListResponse.totalMinServiceFee),
    );
    const newTotalServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.totalNetTicketPrice,
      priceListResponse.totalTax,
      Number(priceListResponse.totalServiceFee) +
        Number(priceListResponse.totalMinServiceFee),
    );
    const newAdultServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.adultNetPrice,
      priceListResponse.adultTax,
      Number(priceListResponse.adultServiceFee) +
        Number(priceListResponse.adultMinServiceFee),
    );
    const newChildServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.childNetPrice,
      priceListResponse.childTax,
      Number(priceListResponse.childServiceFee) +
        Number(priceListResponse.childMinServiceFee),
    );
    const newBabyServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.babyNetPrice,
      priceListResponse.babyTax,
      Number(priceListResponse.babyServiceFee) +
        Number(priceListResponse.babyMinServiceFee),
    );
    const newElderlyMinServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.elderlyNetPrice,
      priceListResponse.elderlyTax,
      Number(priceListResponse.elderlyServiceFee) +
        Number(priceListResponse.elderlyMinServiceFee),
    );
    const newStudentServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.studentNetPrice,
      priceListResponse.studentTax,
      Number(priceListResponse.studentServiceFee) +
        Number(priceListResponse.studentMinServiceFee),
    );
    const newDisabledServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.disabledNetPrice,
      priceListResponse.disabledTax,
      Number(priceListResponse.disabledServiceFee) +
        Number(priceListResponse.disabledMinServiceFee),
    );
    const newMilitaryServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.militaryNetPrice,
      priceListResponse.militaryTax,
      Number(priceListResponse.militaryServiceFee) +
        Number(priceListResponse.militaryMinServiceFee),
    );
    const newYouthServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.youthNetPrice,
      priceListResponse.youthTax,
      Number(priceListResponse.youthServiceFee) +
        Number(priceListResponse.youthMinServiceFee),
    );
    const newTeacherServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.teacherNetPrice,
      priceListResponse.teacherTax,
      Number(priceListResponse.teacherServiceFee) +
        Number(priceListResponse.teacherMinServiceFee),
    );
    const newPressServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.pressNetPrice,
      priceListResponse.pressTax,
      Number(priceListResponse.pressServiceFee) +
        Number(priceListResponse.pressMinServiceFee),
    );
    const newVeteranServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.veteranNetPrice,
      priceListResponse.veteranTax,
      Number(priceListResponse.veteranServiceFee) +
        Number(priceListResponse.veteranMinServiceFee),
    );
    const newVehicleDriverServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.vehicleDriverNetPrice,
      priceListResponse.vehicleDriverTax,
      Number(priceListResponse.vehicleDriverServiceFee) +
        Number(priceListResponse.vehicleDriverMinServiceFee),
    );
    const newAdditionalChildServiceFee =
      PlaneTicketFeeManager.getTotalServiceFee(
        priceListResponse.additionalChildNetPrice,
        priceListResponse.additionalChildTax,
        Number(priceListResponse.additionalChildServiceFee) +
          Number(priceListResponse.additionalChildMinServiceFee),
      );
    const newDiscountedServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
      priceListResponse.discountedNetPrice,
      priceListResponse.discountedTax,
      Number(priceListResponse.discountedServiceFee) +
        Number(priceListResponse.discountedMinServiceFee),
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
