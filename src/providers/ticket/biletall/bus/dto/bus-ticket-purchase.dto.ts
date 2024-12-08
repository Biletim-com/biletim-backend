import { BusTicketPurchaseRequest } from '../types/biletall-bus-ticket-purchase.type';
import { DateTime } from '@app/common/types';

export class BusTicketPurchaseDto {
  result: boolean;
  pnr: string;
  message?: string;
  error?: string;
  tripDateTime: DateTime;
  ticketNumbers: string[];

  constructor({
    Sonuc,
    PNR,
    Mesaj,
    SeferInternetTarihSaat,
    Hata,
    ...rest
  }: BusTicketPurchaseRequest) {
    this.result = Sonuc === 'true';
    this.pnr = PNR;
    this.message = Mesaj;
    this.error = Hata;
    this.tripDateTime = SeferInternetTarihSaat as DateTime;

    this.ticketNumbers = Object.keys(rest)
      .filter((key) => key.startsWith('Ebilet'))
      .map((key) => ({ key, value: rest[key as keyof typeof rest] }))
      .sort((a, b) => {
        const numA = parseInt(a.key.replace('Ebilet', ''), 10);
        const numB = parseInt(b.key.replace('Ebilet', ''), 10);
        return numA - numB;
      })
      .map((item) => item.value);
  }
}
