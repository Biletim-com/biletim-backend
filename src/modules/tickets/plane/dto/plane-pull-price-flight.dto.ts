import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsDateString,
  IsBoolean,
  IsInt,
  Min,
  ValidateNested,
  IsOptional,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AdditionalServiceRule,
  BaggageInfo,
  PaymentRules,
  PlanePrices,
} from '../services/biletall/types/biletall-plane-pull-price-flight.type';
import { ApiProperty } from '@nestjs/swagger';

export class FlightSegmentDto {
  @ApiProperty({
    description: 'Three-letter code of the departure airport.',
    example: 'IST',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  departureAirport: string;

  @ApiProperty({
    description: 'Three-letter code of the  arrival airport.',
    example: 'ATH',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  arrivalAirport: string;

  @ApiProperty({
    description: 'The departure date and time in ISO 8601 format.',
    example: '2024-12-01T15:30:00Z',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  departureDate: string;

  @ApiProperty({
    description: 'The arrival date and time in ISO 8601 format.',
    example: '2024-12-01T18:30:00Z',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  arrivalDate: string;

  @ApiProperty({
    description: 'The flight number.',
    example: '999',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  flightNo: string;

  @ApiProperty({
    description: 'The airline code.',
    example: 'A3',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  airlineCode: string;

  @ApiProperty({
    description: 'The travel class.',
    example: 'P',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  travelClass: string;

  @ApiProperty({
    description: 'Indicates whether this is a return segment.',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isReturnSegment: boolean;

  @ApiProperty({
    description: 'An optional code associated with the flight.',
    example:
      'VG5iNGNIVnFXREtBTFVsTEVBQUFBQT09LDAsQTMsOTk5LElTVCxBVEgsMjAyNC0wOS0xNVQwNTozMDowMC4wMDArMDM6MDAsMjAyNC0wOS0xNVQwNzowMDowMC4wMDArMDM6MDAsUCxQSEZMWFNELEEsRWNvbm9teSwwMDAzLDE1MTc0MTUsRkxFWA==',
    required: false,
  })
  @IsOptional()
  @IsString()
  flightCode?: string;
}

export class PullPriceFlightRequestDto {
  @ApiProperty({
    description: 'The company number.',
    example: '1100',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  companyNo: string;

  @ApiProperty({
    description: 'The list of flight segments.',
    type: [FlightSegmentDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightSegmentDto)
  segments: FlightSegmentDto[];

  @ApiProperty({
    description: 'The number of adults.',
    example: 1,
    required: false,
  })
  @IsInt()
  @Min(0)
  adultCount: number;

  @ApiProperty({
    description: 'The number of childrens.',
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
  seniorCount?: number;

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

export class PriceListDto {
  totalPassengerCount: string;
  totalTicketPrice: string;
  totalNetTicketPrice: string;
  totalTax: string;
  totalServiceFee: string;
  totalMinServiceFee: string;
  adultPassengerCount: string;
  adultNetPrice: string;
  adultTax: string;
  adultServiceFee: string;
  adultMinServiceFee: string;
  adultCompanyCardRequired: string;
  childPassengerCount: string;
  childNetPrice: string;
  childTax: string;
  childServiceFee: string;
  childMinServiceFee: string;
  childCompanyCardRequired: string;
  babyPassengerCount: string;
  babyNetPrice: string;
  babyTax: string;
  babyServiceFee: string;
  babyMinServiceFee: string;
  babyCompanyCardRequired: string;
  elderlyPassengerCount: string;
  elderlyNetPrice: string;
  elderlyTax: string;
  elderlyServiceFee: string;
  elderlyMinServiceFee: string;
  elderlyCompanyCardRequired: string;
  studentPassengerCount: string;
  studentNetPrice: string;
  studentTax: string;
  studentServiceFee: string;
  studentMinServiceFee: string;
  studentCompanyCardRequired: string;
  disabledPassengerCount: string;
  disabledNetPrice: string;
  disabledTax: string;
  disabledServiceFee: string;
  disabledMinServiceFee: string;
  disabledCompanyCardRequired: string;
  militaryPassengerCount: string;
  militaryNetPrice: string;
  militaryTax: string;
  militaryServiceFee: string;
  militaryMinServiceFee: string;
  militaryCompanyCardRequired: string;
  youthPassengerCount: string;
  youthNetPrice: string;
  youthTax: string;
  youthServiceFee: string;
  youthMinServiceFee: string;
  youthCompanyCardRequired: string;
  teacherPassengerCount: string;
  teacherNetPrice: string;
  teacherTax: string;
  teacherServiceFee: string;
  teacherMinServiceFee: string;
  teacherCompanyCardRequired: string;
  pressPassengerCount: string;
  pressNetPrice: string;
  pressTax: string;
  pressServiceFee: string;
  pressMinServiceFee: string;
  pressCompanyCardRequired: string;
  veteranPassengerCount: string;
  veteranNetPrice: string;
  veteranTax: string;
  veteranServiceFee: string;
  veteranMinServiceFee: string;
  veteranCompanyCardRequired: string;
  vehicleDriverPassengerCount: string;
  vehicleDriverNetPrice: string;
  vehicleDriverTax: string;
  vehicleDriverServiceFee: string;
  vehicleDriverMinServiceFee: string;
  vehicleDriverCompanyCardRequired: string;
  additionalChildPassengerCount: string;
  additionalChildNetPrice: string;
  additionalChildTax: string;
  additionalChildServiceFee: string;
  additionalChildMinServiceFee: string;
  additionalChildCompanyCardRequired: string;
  discountedPassengerCount: string;
  discountedNetPrice: string;
  discountedTax: string;
  discountedServiceFee: string;
  discountedMinServiceFee: string;
  discountedCompanyCardRequired: string;
  payment3DSecureActive: string;
  payment3DSecureMandatory: string;
  paypalMaxLimit: string;
  passengerBirthDateMandatory: string;
  passengerPassportNumberMandatory: string;
  emailMandatory: string;
  baServiceFee: string;
  kaServiceFee: string;
  maxServiceFee: string;
  reservationActive: string;

  constructor(priceList: PlanePrices) {
    this.totalPassengerCount = priceList.ToplamYolcuSayisi;
    this.totalTicketPrice = priceList.ToplamBiletFiyati;
    this.totalNetTicketPrice = priceList.ToplamNetBiletFiyati;
    this.totalTax = priceList.ToplamVergi;
    this.totalServiceFee = priceList.ToplamServisUcret;
    this.totalMinServiceFee = priceList.ToplamMinServisUcret;
    this.adultPassengerCount = priceList.YetiskinYolcuSayisi;
    this.adultNetPrice = priceList.YetiskinNetFiyat;
    this.adultTax = priceList.YetiskinVergi;
    this.adultServiceFee = priceList.YetiskinServisUcret;
    this.adultMinServiceFee = priceList.YetiskinMinServisUcret;
    this.adultCompanyCardRequired = priceList.YetiskinFirmaKartZorunluMu;
    this.childPassengerCount = priceList.CocukYolcuSayisi;
    this.childNetPrice = priceList.CocukNetFiyat;
    this.childTax = priceList.CocukVergi;
    this.childServiceFee = priceList.CocukServisUcret;
    this.childMinServiceFee = priceList.CocukMinServisUcret;
    this.childCompanyCardRequired = priceList.CocukFirmaKartZorunluMu;
    this.babyPassengerCount = priceList.BebekYolcuSayisi;
    this.babyNetPrice = priceList.BebekNetFiyat;
    this.babyTax = priceList.BebekVergi;
    this.babyServiceFee = priceList.BebekServisUcret;
    this.babyMinServiceFee = priceList.BebekMinServisUcret;
    this.babyCompanyCardRequired = priceList.BebekFirmaKartZorunluMu;
    this.elderlyPassengerCount = priceList.YasliYolcuSayisi;
    this.elderlyNetPrice = priceList.YasliNetFiyat;
    this.elderlyTax = priceList.YasliVergi;
    this.elderlyServiceFee = priceList.YasliServisUcret;
    this.elderlyMinServiceFee = priceList.YasliMinServisUcret;
    this.elderlyCompanyCardRequired = priceList.YasliFirmaKartZorunluMu;
    this.studentPassengerCount = priceList.OgrenciYolcuSayisi;
    this.studentNetPrice = priceList.OgrenciNetFiyat;
    this.studentTax = priceList.OgrenciVergi;
    this.studentServiceFee = priceList.OgrenciServisUcret;
    this.studentMinServiceFee = priceList.OgrenciMinServisUcret;
    this.studentCompanyCardRequired = priceList.OgrenciFirmaKartZorunluMu;
    this.disabledPassengerCount = priceList.OzurluYolcuSayisi;
    this.disabledNetPrice = priceList.OzurluNetFiyat;
    this.disabledTax = priceList.OzurluVergi;
    this.disabledServiceFee = priceList.OzurluServisUcret;
    this.disabledMinServiceFee = priceList.OzurluMinServisUcret;
    this.disabledCompanyCardRequired = priceList.OzurluFirmaKartZorunluMu;
    this.militaryPassengerCount = priceList.AskerYolcuSayisi;
    this.militaryNetPrice = priceList.AskerNetFiyat;
    this.militaryTax = priceList.AskerVergi;
    this.militaryServiceFee = priceList.AskerServisUcret;
    this.militaryMinServiceFee = priceList.AskerMinServisUcret;
    this.militaryCompanyCardRequired = priceList.AskerFirmaKartZorunluMu;
    this.youthPassengerCount = priceList.GencYolcuSayisi;
    this.youthNetPrice = priceList.GencNetFiyat;
    this.youthTax = priceList.GencVergi;
    this.youthServiceFee = priceList.GencServisUcret;
    this.youthMinServiceFee = priceList.GencMinServisUcret;
    this.youthCompanyCardRequired = priceList.GencFirmaKartZorunluMu;
    this.teacherPassengerCount = priceList.OgretmenYolcuSayisi;
    this.teacherNetPrice = priceList.OgretmenNetFiyat;
    this.teacherTax = priceList.OgretmenVergi;
    this.teacherServiceFee = priceList.OgretmenServisUcret;
    this.teacherMinServiceFee = priceList.OgretmenMinServisUcret;
    this.teacherCompanyCardRequired = priceList.OgretmenFirmaKartZorunluMu;
    this.pressPassengerCount = priceList.BasinYolcuSayisi;
    this.pressNetPrice = priceList.BasinNetFiyat;
    this.pressTax = priceList.BasinVergi;
    this.pressServiceFee = priceList.BasinServisUcret;
    this.pressMinServiceFee = priceList.BasinMinServisUcret;
    this.pressCompanyCardRequired = priceList.BasinFirmaKartZorunluMu;
    this.veteranPassengerCount = priceList.GaziYolcuSayisi;
    this.veteranNetPrice = priceList.GaziNetFiyat;
    this.veteranTax = priceList.GaziVergi;
    this.veteranServiceFee = priceList.GaziServisUcret;
    this.veteranMinServiceFee = priceList.GaziMinServisUcret;
    this.veteranCompanyCardRequired = priceList.GaziFirmaKartZorunluMu;
    this.vehicleDriverPassengerCount = priceList.AracSurucuYolcuSayisi;
    this.vehicleDriverNetPrice = priceList.AracSurucuNetFiyat;
    this.vehicleDriverTax = priceList.AracSurucuVergi;
    this.vehicleDriverServiceFee = priceList.AracSurucuServisUcret;
    this.vehicleDriverMinServiceFee = priceList.AracSurucuMinServisUcret;
    this.vehicleDriverCompanyCardRequired =
      priceList.AracSurucuFirmaKartZorunluMu;
    this.additionalChildPassengerCount = priceList.EkCocukYolcuSayisi;
    this.additionalChildNetPrice = priceList.EkCocukNetFiyat;
    this.additionalChildTax = priceList.EkCocukVergi;
    this.additionalChildServiceFee = priceList.EkCocukServisUcret;
    this.additionalChildMinServiceFee = priceList.EkCocukMinServisUcret;
    this.additionalChildCompanyCardRequired =
      priceList.EkCocukFirmaKartZorunluMu;
    this.discountedPassengerCount = priceList.IndirimliYolcuSayisi;
    this.discountedNetPrice = priceList.IndirimliNetFiyat;
    this.discountedTax = priceList.IndirimliVergi;
    this.discountedServiceFee = priceList.IndirimliServisUcret;
    this.discountedMinServiceFee = priceList.IndirimliMinServisUcret;
    this.discountedCompanyCardRequired = priceList.IndirimliFirmaKartZorunluMu;
    this.payment3DSecureActive = priceList.Odeme3DSecureAktifMi;
    this.payment3DSecureMandatory = priceList.Odeme3DSecureZorunluMu;
    this.paypalMaxLimit = priceList.PaypalUstLimit;
    this.passengerBirthDateMandatory = priceList.YolcuDogumTarihiZorunluMu;
    this.passengerPassportNumberMandatory = priceList.YolcuPasaportNoZorunluMu;
    this.emailMandatory = priceList.EmailZorunluMu;
    this.baServiceFee = priceList.BaServisUcret;
    this.kaServiceFee = priceList.KaServisUcret;
    this.maxServiceFee = priceList.MaxServisUcret;
    this.reservationActive = priceList.RezervasyonAktifMi;
  }
}

export class PlanePaymentRulesDto {
  payment3DSecureActive: string;
  payment3DSecureMandatory: string;
  paymentAdvanceActive: string;
  prePaymentActive: string;
  paymentCodeActive: string;
  bkmPaymentActive: string;
  paypalPaymentActive: string;
  paypalMaxLimit: string;
  hopiActive: string;
  masterpassActive: string;
  fastPayPaymentActive: string;

  constructor(paymentRules: PaymentRules) {
    this.payment3DSecureActive = paymentRules.Odeme3DSecureAktifMi;
    this.payment3DSecureMandatory = paymentRules.Odeme3DSecureZorunluMu;
    this.paymentAdvanceActive = paymentRules.AcikParaliOdemeAktifMi;
    this.prePaymentActive = paymentRules.OnOdemeAktifMi;
    this.paymentCodeActive = paymentRules.ParakodOdemeAktifMi;
    this.bkmPaymentActive = paymentRules.BkmOdemeAktifMi;
    this.paypalPaymentActive = paymentRules.PaypalOdemeAktifMi;
    this.paypalMaxLimit = paymentRules.PaypalUstLimit;
    this.hopiActive = paymentRules.HopiAktifMi;
    this.masterpassActive = paymentRules.MasterpassAktifMi;
    this.fastPayPaymentActive = paymentRules.FastPayOdemeAktifMi;
  }
}

export class PlaneBaggageInfoDto {
  passengerType: string;
  segmentFrom: string;
  segmentTo: string;
  segmentDateTime: string;
  baggageQuantity: string;
  baggageUnit: string;

  constructor(baggageInfo: BaggageInfo) {
    this.passengerType = baggageInfo.YolcuTip;
    this.segmentFrom = baggageInfo.SegmentNereden;
    this.segmentTo = baggageInfo.SegmentNereye;
    this.segmentDateTime = baggageInfo.SegmentTarihSaat;
    this.baggageQuantity = baggageInfo.BagajMiktar;
    this.baggageUnit = baggageInfo.BagajBirim;
  }
}

export class PlaneAdditionalServiceRuleDto {
  useSeat: string[];
  useBaggage: string[];
  useMeal: string[];
  useCabinBaggage: string[];
  useService: string[];

  constructor(additionalServiceRule: AdditionalServiceRule) {
    this.useSeat = additionalServiceRule.KullanKoltuk;
    this.useBaggage = additionalServiceRule.KullanBagaj;
    this.useMeal = additionalServiceRule.KullanYemek;
    this.useCabinBaggage = additionalServiceRule.KullanKabinBagaj;
    this.useService = additionalServiceRule.EkHizmetKullan;
  }
}

export class PlaneAdditionalServiceRulesDto {
  AdditionalServiceRule: PlaneAdditionalServiceRuleDto[];

  constructor(ekHizmetKural: PlaneAdditionalServiceRuleDto[]) {
    this.AdditionalServiceRule = ekHizmetKural;
  }
}

export class PlanePullPriceFlightDto {
  constructor(
    public priceList: PriceListDto,
    public paymentRules: PlanePaymentRulesDto,
    public baggageInfo?: PlaneBaggageInfoDto[],
    public additionalServiceRules?: PlaneAdditionalServiceRulesDto[],
  ) {}
}
