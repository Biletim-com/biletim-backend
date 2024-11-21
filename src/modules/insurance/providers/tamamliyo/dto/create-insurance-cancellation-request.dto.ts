import { IsTCNumber } from '@app/common/decorators';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { CreateInsuranceCancellationRequestResponse } from '../types/create-insurance-cancellation-request.type';

export class CreateInsuranceCancellationRequestDto {
  @IsInt()
  @IsNotEmpty()
  offerId: number;

  @IsTCNumber()
  @IsInt()
  @IsNotEmpty()
  customerTcNumber: number;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerEmail: string;

  @IsInt()
  @IsNotEmpty()
  customerPhone: number;
}

export class CreateInsuranceCancellationRequestDtoInTurkish {
  teklif_id: number;
  tc_kimlik_no: number;
  musteri_adi: string;
  musteri_email: string;
  partner_email: string;
  musteri_telefon: number;
}

export class CreateInsuranceCancellationRequestResponseDto {
  data: {
    id: number;
    partnerId: number;
    offerId: number;
    tcNumber: string;
    status: string;
    customerName: string;
    customerEmail: string;
    partnerEmail: string;
    customerPhone: number;
    productName?: string | undefined;
    createdAt: string;
    updatedAt: string;
  };

  constructor(data: CreateInsuranceCancellationRequestResponse) {
    this.data.id = data.data.id;
    this.data.partnerId = data.data.partner_id;
    this.data.offerId = data.data.teklif_id;
    this.data.tcNumber = data.data.tc_kimlik_no;
    this.data.status = data.data.durum;
    this.data.customerName = data.data.musteri_adi;
    this.data.customerEmail = data.data.musteri_email;
    this.data.partnerEmail = data.data.partner_email;
    this.data.customerPhone = data.data.musteri_telefon;
    this.data.productName = data.data?.urun_adi;
    this.data.createdAt = data.data.created_at;
    this.data.updatedAt = data.data.updated_at;
  }
}
