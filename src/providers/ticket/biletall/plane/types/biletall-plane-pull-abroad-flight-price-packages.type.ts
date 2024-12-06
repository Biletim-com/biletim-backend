import { SoapEnvelope } from '../../types/biletall-soap-envelope.type';

export type BrandFareInfo = {
  IsBundle: string;
  TripType: string;
  BrandPriceInfo: BrandPriceInfo;
  BrandInfo: BrandInfo;
  BrandSegmentInfos: BrandSegmentInfo[];
  BrandImportantNotes: BrandImportantNote[];
};

export type BrandPriceInfo = {
  PassengerTypeFareInfos: PassengerTypeFareInfo[];
  ServicePriceMax: string;
  ServicePriceKA: string;
  ServicePriceBA: string;
  TotalPassengerCount: string;
  TotalPrice: string;
  TotalBasePrice: string;
  TotalTaxPrice: string;
  TotalServicePrice: string;
  TotalMinimumServicePrice: string;
  BaggageInformation: string;
};

export type PassengerTypeFareInfo = {
  PassengerCount: string;
  PassengerType: string;
  PriceOfPieces: PriceOfPiece[];
  BaggageAllowances: BaggageAllowance[];
  SinglePassengerPrice: string;
  TotalPrice: string;
  MinimumServicePrice: string;
  IsFirmCardRequired: string;
};

export type PriceOfPiece = {
  PriceType: string;
  Price: string;
};

export type SeatBaggage = {
  PieceCount?: string;
  Amount?: string;
  Unit?: string;
  BaggageType?: string[];
  Dimensions?: string;
  SeatBaggageInfo?: string;
};
export type BaggageAllowance = {
  Origin: string;
  Destination: string;
  DepartureTime: string;
  Carrier: string;
  SeatBaggage: SeatBaggage;
};

export type BrandInfo = {
  IsActive: string;
  IsRecommended: string;
  BrandId: string;
  BrandCode: string;
  BrandName: string;
  BrandTier: string;
  BrandNote: string;
  Class: string;
  CabinClass: string;
  BrandServiceInfos: BrandServiceInfo[];
};

export type BrandServiceInfo = {
  BrandServices: BrandService[];
  Name: string;
  Order: string;
};

export type BrandService = {
  Definition: string;
  ServiceStatus: string;
  ServiceType: string;
  ServiceTag: string;
  DisplayOrder: string;
};

export type BrandSegmentInfo = {
  CompanyNo: string;
  Origin: string;
  Destination: string;
  ClassOfService: string;
  DepartureTime: string;
  ArrivalTime: string;
  CabinClass: string;
  FlightNumber: string;
  CarrierCode: string;
  OperatingCarrierCode: string;
  FareRuleKey: string;
  TripCode: string;
  PricePackageDefinition: string;
  PricePackageKey: string;
  IsReturn: string;
  PricePackageDetailKey: string;
  FareInfoRef: string;
  Group: string;
};

export type BrandImportantNote = {
  Note: string;
  Origin: string;
  Destination: string;
};

export type BrandFareDataSet = {
  BrandFareResponse: Array<{
    TransactionId: string[];
    IsSuccess: string[];
    Message?: string[];
    CurrencyTypeCode: string[];
    BrandFareInfos: Array<{
      BrandFareInfo: Array<BrandFareInfo>;
    }>;
  }>;
};

export type pullAbroadFlightPricePackagesResponse =
  SoapEnvelope<BrandFareDataSet>;
