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

export class FlightSegmentDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  departureAirport: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  arrivalAirport: string;

  @IsDateString()
  @IsNotEmpty()
  departureDate: string;

  @IsDateString()
  @IsNotEmpty()
  arrivalDate: string;

  @IsString()
  @IsNotEmpty()
  flightNo: string;

  @IsString()
  @IsOptional()
  airlineCode: string;

  @IsString()
  @IsNotEmpty()
  travelClass: string;

  @IsBoolean()
  @IsOptional()
  isReturnSegment: boolean;

  @IsOptional()
  @IsString()
  flightCode?: string;
}

export class PullPriceFlightRequestDto {
  @IsString()
  @IsNotEmpty()
  companyNo: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlightSegmentDto)
  segments: FlightSegmentDto[];

  @IsOptional()
  @IsInt()
  @Min(0)
  adultCount: number;

  @IsInt()
  @Min(0)
  childCount: number;

  @IsInt()
  @Min(0)
  babyCount?: number;

  @IsOptional()
  @IsInt()
  studentCount?: number;

  @IsOptional()
  @IsInt()
  seniorCount?: number;

  @IsOptional()
  @IsInt()
  militaryCount?: number;

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
