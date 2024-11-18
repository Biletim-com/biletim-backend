import { IsOptional, IsString } from 'class-validator';
import { BiletAllCompany } from '../services/biletall/types/biletall-company.type';
import { ApiProperty } from '@nestjs/swagger';

export class BusCompanyRequestDto {
  @ApiProperty({
    description: 'Company number (Optional)',
    example: '0',
    required: false,
  })
  @IsString()
  @IsOptional()
  companyNumber?: string;
}

export class BusCompanyDto {
  companyNumber: string;
  companyName: string;
  companyLogo: string;
  emptyBranchCode: string;
  emptyUserCode: string;
  ticketSerialNumberTracking: string;
  ticketSerialNumber: string;
  website: string;
  phone: string;
  soldSeatCount: string;
  reservedSeatCount: string;
  companyNumberStr: string;
  maxSameMemberCardTransactionInBus: string;
  canPerformMultiGenderTransaction: string;
  cancellationPeriodUntilDepartureMinutes: string;
  isTicketCancellationActive: string;
  isOpenMoneyUsageActive: string;

  constructor(company: BiletAllCompany) {
    this.companyNumber = company.Firma_No;
    this.companyName = company.Firmaadi;
    this.companyLogo = company.FirmaLogo;
    this.emptyBranchCode = company.BosSubeKodu;
    this.emptyUserCode = company.BosKullaniciKodu;
    this.ticketSerialNumberTracking = company.Bilet_Seri_No_Takip;
    this.ticketSerialNumber = company.Bilet_Seri_No;
    this.website = company.WebAdresi;
    this.phone = company.Telefon;
    this.soldSeatCount = company.Sat_Koltuk_Adet;
    this.reservedSeatCount = company.Rez_Koltuk_Adet;
    this.companyNumberStr = company.FirmaNoStr;
    this.maxSameMemberCardTransactionInBus =
      company.FirmaOtobusteMaxAyniUyeKartliIslemSayisi;
    this.canPerformMultiGenderTransaction =
      company.FirmaCokluCinsiyetIslemYapabilir;
    this.cancellationPeriodUntilDepartureMinutes =
      company.SefereKadarIptalEdilebilmeSuresiDakika;
    this.isTicketCancellationActive = company.BiletIptalAktifMi;
    this.isOpenMoneyUsageActive = company.AcikParaKullanimAktifMi;
  }
}
