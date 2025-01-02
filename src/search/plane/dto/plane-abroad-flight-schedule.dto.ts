import { FlightClassType } from '@app/common/enums';
import { IsBoolean, IsOptional } from 'class-validator';
import { IsInEnumKeys } from '@app/common/decorators';
import { ApiProperty } from '@nestjs/swagger';

import { PlaneDomesticFlightScheduleRequestDto } from './plane-domestic-flight-schedule.dto';
import { AbroadFlightDto } from '@app/providers/ticket/biletall/plane/dto/plane-abroad-flight-schedule.dto';
import { PlaneTicketFeeManager } from '@app/common/utils';

export class PlaneAbroadFlightScheduleRequestDto extends PlaneDomesticFlightScheduleRequestDto {
  @ApiProperty({
    description: 'Indicates whether to split the search results.',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  splitSearch?: boolean;

  @ApiProperty({
    description:
      'Indicates whether to split the search results for round trips.',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  splitSearchRoundTripGroup?: boolean;

  @ApiProperty({
    description: `The class type of the flight. If no class type is specified, all class types will be included in the search results.`,
    example: 'ECONOMY',
    required: false,
  })
  @IsOptional()
  @IsInEnumKeys(
    FlightClassType,
    {
      message: 'Flight class must be a valid enum key (ECONOMY, BUSINESS)',
    },
    true,
  )
  classType?: FlightClassType;
}

export class PlaneAbroadFlightScheduleResponseDto {
  public readonly departureFlights: AbroadFlightDto[];
  public readonly returnFlights: AbroadFlightDto[];

  constructor(
    departureFlights: AbroadFlightDto[],
    returnFlights: AbroadFlightDto[],
    public readonly operationId: string | null = null,
  ) {
    this.departureFlights = this.addCommissionRate(departureFlights);
    this.returnFlights = this.addCommissionRate(returnFlights);
  }

  private addCommissionRate(
    abroadFlights: AbroadFlightDto[],
  ): AbroadFlightDto[] {
    const newAbroadFLights = [...abroadFlights];
    newAbroadFLights.forEach((abroadFlight) => {
      /**
       * set new service fee and totalPrice
       */
      const newServiceFee = PlaneTicketFeeManager.getTotalServiceFee(
        abroadFlight.flightOption.vPrice,
        0,
        abroadFlight.flightOption.serviceFee,
      ).toString();
      const totalPrice = PlaneTicketFeeManager.getTotalPriceWithFee(
        abroadFlight.flightOption.vPrice,
        0,
        abroadFlight.flightOption.serviceFee,
      );

      abroadFlight.flightOption = {
        ...abroadFlight.flightOption,
        serviceFee: newServiceFee,
      };
      abroadFlight.flightOption['totalPrice'] = totalPrice.toString();

      /**
       * set company logo url
       */
      abroadFlight.segments.forEach((segment) => {
        segment[
          'companyLogo'
        ] = `https://ws.biletall.com/HavaYoluLogo/orta/${segment.airlineCode}.png`;
      });
    });
    return newAbroadFLights;
  }
}
