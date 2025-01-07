import { PlaneTravelType } from '@app/common/enums';
import { PlaneTicketOperationType } from '@app/common/enums';
import { DateISODate } from '@app/common/types';
import { Expose, Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

import { IsInEnumKeys } from '@app/common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { DomesticFlightWithFares } from '@app/providers/ticket/biletall/plane/dto/plane-domestic-flight-schedule.dto';

// utils
import { PlaneTicketFeeManager } from '@app/common/utils';

export class PlaneDomesticFlightScheduleRequestDto {
  @ApiProperty({
    description: 'Three-letter code of the departure airport',
    example: 'ESB',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  departureAirport: string;

  @ApiProperty({
    description: 'Three-letter code of the arrival airport',
    example: 'KCM',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  arrivalAirport: string;

  @ApiProperty({
    description: 'Departure date in yyyy-MM-dd format',
    example: '2024-09-15',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  departureDate: DateISODate;

  @ApiProperty({
    description: 'Return date in yyyy-MM-dd format',
    example: '2024-09-20',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @MaxLength(10, { message: 'Only provide the date part: YYYY-MM-DD' })
  returnDate: DateISODate;

  @Expose()
  @Transform(({ obj }) =>
    obj.returnDate ? PlaneTravelType.ROUNDTRIP : PlaneTravelType.ONEWAY,
  )
  @IsEnum(PlaneTravelType, {
    message: `Must be a valid value: ${Object.values(PlaneTravelType)}`,
  })
  travelType: PlaneTravelType;

  @ApiProperty({
    description: 'Operation type, either PURCHASE or RESERVATION',
    example: 'SALE',
    required: true,
  })
  @IsNotEmpty()
  @IsInEnumKeys(PlaneTicketOperationType, {
    message: 'Operation type must be valid key (PURCHASE or RESERVATION) ',
  })
  operationType: PlaneTicketOperationType;

  @ApiProperty({
    description: 'Number of adults',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  adultCount: number;

  @ApiProperty({
    description: 'Number of children',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  childCount = 0;

  @ApiProperty({
    description: 'Number of babies',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  babyCount = 0;
}

export class PlaneDomesticFlightScheduleResponseDto {
  public readonly departureFlightsWithFares: Array<DomesticFlightWithFares>;
  public readonly returnFlightsWithFares: Array<DomesticFlightWithFares>;
  constructor(
    departureFlights: Array<DomesticFlightWithFares>,
    returnFlights: Array<DomesticFlightWithFares>,
  ) {
    this.departureFlightsWithFares = this.addCommissionRate(departureFlights);
    this.returnFlightsWithFares = this.addCommissionRate(returnFlights);
  }

  private addCommissionRate(
    domesticFlights: Array<DomesticFlightWithFares>,
  ): Array<DomesticFlightWithFares> {
    const newDomesticFlights = [...domesticFlights];
    newDomesticFlights.forEach((domesticFlight) => {
      domesticFlight.flightOption = {
        ...domesticFlight.flightOption,
        /**
         * set single service fees
         */
        // Flight Class P
        serviceFeeP: PlaneTicketFeeManager.getTotalServiceFee(
          domesticFlight.flightOption.priceP,
          0,
          domesticFlight.flightOption.serviceFeeP,
        ).toString(),
        // FLight class Economy
        serviceFeeE: PlaneTicketFeeManager.getTotalServiceFee(
          domesticFlight.flightOption.priceE,
          0,
          domesticFlight.flightOption.serviceFeeE,
        ).toString(),
        // Flight class Business
        serviceFeeB: PlaneTicketFeeManager.getTotalServiceFee(
          domesticFlight.flightOption.priceB,
          0,
          domesticFlight.flightOption.serviceFeeB,
        ).toString(),

        /**
         * set total service fees
         */
        // Flight class P
        totalServiceFeeP: PlaneTicketFeeManager.getTotalServiceFee(
          domesticFlight.flightOption.totalPriceP,
          0,
          domesticFlight.flightOption.totalServiceFeeP,
        ).toString(),
        // Flight class Economy
        totalServiceFeeE: PlaneTicketFeeManager.getTotalServiceFee(
          domesticFlight.flightOption.totalPriceE,
          0,
          domesticFlight.flightOption.totalServiceFeeE,
        ).toString(),
        // Flight class Business
        totalServiceFeeB: PlaneTicketFeeManager.getTotalServiceFee(
          domesticFlight.flightOption.totalPriceB,
          0,
          domesticFlight.flightOption.totalServiceFeeB,
        ).toString(),
      };

      domesticFlight.segments.forEach((segment) => {
        segment[
          'companyLogo'
        ] = `https://ws.biletall.com/HavaYoluLogo/orta/${segment.companyId}.png`;

        segment.optionFares.forEach((optionFare) => {
          // set single passenger fee
          optionFare.singlePassengerServiceFee =
            PlaneTicketFeeManager.getTotalServiceFee(
              optionFare.singlePassengerFee,
              0,
              optionFare.singlePassengerServiceFee,
            ).toString();

          // set multiple passenger fee
          optionFare.totalServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
            optionFare.totalFee,
            0,
            optionFare.totalServiceFee,
          ).toString();

          // set total price in the segment class object
          if (optionFare.segmentClass) {
            optionFare.segmentClass = {
              ...optionFare.segmentClass,
              fee: PlaneTicketFeeManager.getTotalPriceWithFee(
                optionFare.segmentClass?.fee ?? '0',
                0,
                0,
              ).toString(),
            };
          }
        });
      });
    });
    return newDomesticFlights;
  }
}
