import { IsTCNumber } from '@app/common/decorators';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import {
  CreateInsuranceCancellationFailureRequestResponse,
  CreateInsuranceCancellationSuccessfulRequestResponse,
} from '../types/create-insurance-cancellation-request.type';

export class CreateInsuranceCancellationRequestDto {
  @IsInt()
  @IsNotEmpty()
  offerId: number;

  @IsTCNumber()
  @IsNotEmpty()
  customerTcNumber: string;

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
  tc_kimlik_no: string;
  musteri_adi: string;
  musteri_email: string;
  partner_email: string;
  musteri_telefon: number;
}

export class CreateInsuranceCancellationSuccessfulRequestResponseDto {
  success: string;
  message: string;
  data: {
    id: number;
    partnerId: number;
    offerId: number;
    tcNumber: number;
    status: string;
    customerName: string;
    customerEmail: string;
    partnerEmail: string;
    customerPhone: number;
    productName?: string | undefined;
    createdAt: string;
    updatedAt: string;
  };

  constructor(
    success: string,
    message: string,
    data: CreateInsuranceCancellationSuccessfulRequestResponse['data'],
  ) {
    this.success = success;
    this.message = message;
    this.data = {
      id: data.id,
      partnerId: data.partner_id,
      offerId: data.teklif_id,
      tcNumber: data.tc_kimlik_no,
      status: data.durum,
      customerName: data.musteri_adi,
      customerEmail: data.musteri_email,
      partnerEmail: data.partner_email,
      customerPhone: data.musteri_telefon,
      productName: data?.urun_adi,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export class CreateInsuranceCancellationFailureRequestResponseDto {
  success: string;
  data: {
    error: string;
  };

  constructor(data: CreateInsuranceCancellationFailureRequestResponse) {
    this.success = data.success;
    this.data = {
      error: data.data.error,
    };
  }
}
