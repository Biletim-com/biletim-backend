import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import {
  BaggageAllowance,
  BrandFareInfo,
  BrandImportantNote,
  BrandInfo,
  BrandPriceInfo,
  BrandSegmentInfo,
  BrandService,
  BrandServiceInfo,
  PassengerTypeFareInfo,
  PriceOfPiece,
  SeatBaggage,
} from '../services/biletall/types/biletall-plane-pull-abroad-flight-price-packages.type';

class PullAbroadFlightPricePackagesSegmentDto {
  @ApiProperty({
    description: 'Departure airport code.',
    example: 'SAW',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  departureAirport: string;

  @ApiProperty({
    description: 'Arrival airport code.',
    example: 'MUC',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  arrivalAirport: string;

  @ApiProperty({
    description: 'Flight departure time (ISO format).',
    example: '2024-09-30T10:10:00',
  })
  @IsNotEmpty()
  @IsDateString()
  departureDate: string;

  @ApiProperty({
    description: 'Flight arrival time (ISO format).',
    example: '2024-09-30T12:05:00',
  })
  @IsNotEmpty()
  @IsDateString()
  arrivalDate: string;

  @ApiProperty({
    description: 'Flight number.',
    example: '41',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  flightNumber: string;

  @ApiProperty({
    description: 'Company code for the airline.',
    example: 'VF',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  airlineCode: string;

  @ApiProperty({
    description: 'Class of the flight.',
    example: 'V',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  flightClass: string;

  @ApiProperty({
    description:
      'Indicates if this segment is a return flight (1 for return, 0 for one-way).',
    example: '0',
  })
  @IsNotEmpty()
  isReturnFlight: boolean;

  @ApiProperty({
    description: 'Flight segment code (SeferKod).',
    example:
      'UHNIcU5GSkV1REtBVmFEN210QUFBQT09LDAsVkYsNDEsU0FXLE1VQywyMDI0LTA5LTMwVDEwOjEwOjAwLjAwMCswMzowMCwyMDI0LTA5LTMwVDEyOjA1OjAwLjAwMCswMjowMCxWLFZIVFNBSlJPLEEsRWNvbm9teSwwMDAxLDE1MTM3MTIsQkFTSUM=',
  })
  @IsString()
  @IsOptional()
  flightCode: string;
}

export class PullAbroadFlightPricePackagesRequestDto {
  @ApiProperty({
    description: 'Unique operation ID for the request.',
    example: '62062f6a-3140-4843-bbdd-8161579842f6',
  })
  @IsNotEmpty()
  @IsString()
  operationId: string;

  @ApiProperty({
    description: 'Company number providing the flight.',
    example: '1100',
  })
  @IsNotEmpty()
  companyNumber: string;

  @ApiProperty({
    description: 'Flight segment information for the flight.',
    type: [PullAbroadFlightPricePackagesSegmentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PullAbroadFlightPricePackagesSegmentDto)
  segments: PullAbroadFlightPricePackagesSegmentDto[];

  @ApiProperty({
    description: 'Number of adult passengers.',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  adultCount?: number;

  @ApiPropertyOptional({
    description: 'Number of child passengers.',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  childCount?: number;

  @ApiPropertyOptional({
    description: 'Number of infant passengers.',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  babyCount?: number;

  @ApiPropertyOptional({
    description: 'Number of student passengers.',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  studentCount?: number;

  @ApiPropertyOptional({
    description: 'Number of senior passengers.',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  elderlyCount?: number;

  @ApiPropertyOptional({
    description: 'Number of military passengers.',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  militaryCount?: number;

  @ApiPropertyOptional({
    description: 'Number of youth passengers.',
    example: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  youthCount?: number;
}

export class PriceOfPieceDto {
  priceType: string;
  price: string;

  constructor(data: PriceOfPiece) {
    this.priceType = data.PriceType;
    this.price = data.Price;
  }
}
export class SeatBaggageDto {
  pieceCount?: string;
  amount?: string;
  unit?: string;
  baggageType?: string[];
  dimensions?: string;
  seatBaggageInfo?: string;

  constructor(data: SeatBaggage) {
    this.pieceCount = data.PieceCount;
    this.amount = data.Amount;
    this.unit = data.Unit;
    this.baggageType = data.BaggageType;
    this.dimensions = data.Dimensions;
    this.seatBaggageInfo = data.SeatBaggageInfo;
  }
}
export class BaggageAllowanceDto {
  origin: string;
  destination: string;
  departureTime: string;
  carrier: string;
  seatBaggage?: SeatBaggageDto;

  constructor(data: BaggageAllowance) {
    this.origin = data.Origin;
    this.destination = data.Destination;
    this.departureTime = data.DepartureTime;
    this.carrier = data.Carrier;
    this.seatBaggage = new SeatBaggageDto(data.SeatBaggage);
  }
}

export class PassengerTypeFareInfoDto {
  passengerCount: string;
  passengerType: string;
  priceOfPieces: PriceOfPieceDto[];
  baggageAllowances: BaggageAllowanceDto[];
  singlePassengerPrice: string;
  totalPrice: string;
  minimumServicePrice: string;
  isFirmCardRequired: string;

  constructor(data: PassengerTypeFareInfo) {
    this.passengerCount = data.PassengerCount;
    this.passengerType = data.PassengerType;
    this.priceOfPieces = data.PriceOfPieces.map(
      (piece) => new PriceOfPieceDto(piece),
    );
    this.baggageAllowances = data.BaggageAllowances.map(
      (allowance) => new BaggageAllowanceDto(allowance),
    );
    this.singlePassengerPrice = data.SinglePassengerPrice;
    this.totalPrice = data.TotalPrice;
    this.minimumServicePrice = data.MinimumServicePrice;
    this.isFirmCardRequired = data.IsFirmCardRequired;
  }
}

export class BrandPriceInfoDto {
  passengerTypeFareInfos: PassengerTypeFareInfoDto[];
  servicePriceMax: string;
  servicePriceKA: string;
  servicePriceBA: string;
  totalPassengerCount: string;
  totalPrice: string;
  totalBasePrice: string;
  totalTaxPrice: string;
  totalServicePrice: string;
  totalMinimumServicePrice: string;
  baggageInformation: string;

  constructor(data: BrandPriceInfo) {
    this.passengerTypeFareInfos = (data.PassengerTypeFareInfos || []).map(
      (fareInfo) => new PassengerTypeFareInfoDto(fareInfo),
    );
    this.servicePriceMax = data.ServicePriceMax;
    this.servicePriceKA = data.ServicePriceKA;
    this.servicePriceBA = data.ServicePriceBA;
    this.totalPassengerCount = data.TotalPassengerCount;
    this.totalPrice = data.TotalPrice;
    this.totalBasePrice = data.TotalBasePrice;
    this.totalTaxPrice = data.TotalTaxPrice;
    this.totalServicePrice = data.TotalServicePrice;
    this.totalMinimumServicePrice = data.TotalMinimumServicePrice;
    this.baggageInformation = data.BaggageInformation;
  }
}

export class BrandImportantNoteDto {
  note: string;
  origin: string;
  destination: string;

  constructor(data: BrandImportantNote) {
    this.note = data.Note;
    this.origin = data.Origin;
    this.destination = data.Destination;
  }
}

export class BrandSegmentInfoDto {
  companyNo: string;
  origin: string;
  destination: string;
  classOfService: string;
  departureTime: string;
  arrivalTime: string;
  cabinClass: string;
  flightNumber: string;
  carrierCode: string;
  operatingCarrierCode: string;
  fareRuleKey: string;
  tripCode: string;
  pricePackageDefinition: string;
  pricePackageKey: string;
  isReturn: string;
  pricePackageDetailKey: string;
  fareInfoRef: string;
  group: string;

  constructor(data: BrandSegmentInfo) {
    this.companyNo = data.CompanyNo;
    this.origin = data.Origin;
    this.destination = data.Destination;
    this.classOfService = data.ClassOfService;
    this.departureTime = data.DepartureTime;
    this.arrivalTime = data.ArrivalTime;
    this.cabinClass = data.CabinClass;
    this.flightNumber = data.FlightNumber;
    this.carrierCode = data.CarrierCode;
    this.operatingCarrierCode = data.OperatingCarrierCode;
    this.fareRuleKey = data.FareRuleKey;
    this.tripCode = data.TripCode;
    this.pricePackageDefinition = data.PricePackageDefinition;
    this.pricePackageKey = data.PricePackageKey;
    this.isReturn = data.IsReturn;
    this.pricePackageDetailKey = data.PricePackageDetailKey;
    this.fareInfoRef = data.FareInfoRef;
    this.group = data.Group;
  }
}

export class BrandInfoDto {
  isActive: string;
  isRecommended: string;
  brandId: string;
  brandCode: string;
  brandName: string;
  brandTier: string;
  brandNote: string;
  class: string;
  cabinClass: string;
  brandServiceInfos: BrandServiceInfoDto[];

  constructor(data: BrandInfo) {
    this.isActive = data.IsActive;
    this.isRecommended = data.IsRecommended;
    this.brandId = data.BrandId;
    this.brandCode = data.BrandCode;
    this.brandName = data.BrandName;
    this.brandTier = data.BrandTier;
    this.brandNote = data.BrandNote;
    this.class = data.Class;
    this.cabinClass = data.CabinClass;
    this.brandServiceInfos = data.BrandServiceInfos.map(
      (serviceInfo) => new BrandServiceInfoDto(serviceInfo),
    );
  }
}

export class BrandServiceInfoDto {
  brandServices: BrandServiceDto[];
  name: string;
  order: string;

  constructor(data: BrandServiceInfo) {
    this.brandServices = data.BrandServices.map(
      (service) => new BrandServiceDto(service),
    );
    this.name = data.Name;
    this.order = data.Order;
  }
}

export class BrandServiceDto {
  definition: string;
  serviceStatus: string;
  serviceType: string;
  serviceTag: string;
  displayOrder: string;

  constructor(data: BrandService) {
    this.definition = data.Definition;
    this.serviceStatus = data.ServiceStatus;
    this.serviceType = data.ServiceType;
    this.serviceTag = data.ServiceTag;
    this.displayOrder = data.DisplayOrder;
  }
}

export class BrandFareInfoDto {
  isBundle: string;
  tripType: string;
  brandPriceInfo: BrandPriceInfoDto;
  brandInfo: BrandInfoDto;
  brandSegmentInfos: BrandSegmentInfoDto[];
  brandImportantNotes: BrandImportantNoteDto[];

  constructor(data: BrandFareInfo) {
    this.isBundle = data.IsBundle;
    this.tripType = data.TripType;
    this.brandPriceInfo = new BrandPriceInfoDto(data.BrandPriceInfo);
    this.brandInfo = new BrandInfoDto(data.BrandInfo);
    this.brandSegmentInfos = data.BrandSegmentInfos.map(
      (segmentInfo) => new BrandSegmentInfoDto(segmentInfo),
    );
    this.brandImportantNotes = data.BrandImportantNotes.map(
      (note) => new BrandImportantNoteDto(note),
    );
  }
}

export class PullAbroadFlightPricePackagesResponseDto {
  constructor(
    public transactionId: string,
    public currencyTypeCode: string,
    public isSuccess: boolean,
    public message: string,
    public brandFareInfos: BrandFareInfoDto[],
  ) {}
}
