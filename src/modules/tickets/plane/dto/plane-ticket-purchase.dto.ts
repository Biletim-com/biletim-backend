import { FlightTicketPurchaseResult } from '../services/biletall/types/biletall-plane-ticket-purchase.type';

export class FlightTicketPurchaseDto {
  result: boolean;
  pnr: string;
  message?: string;
  error?: string;
  ticketNumbers: string[];

  constructor({
    Sonuc,
    PNR,
    Mesaj,
    Hata,
    ...EBilets
  }: FlightTicketPurchaseResult) {
    this.result = Sonuc === 'true';
    this.pnr = PNR;
    this.message = Mesaj;
    this.error = Hata;

    this.ticketNumbers = Object.keys(EBilets)
      .filter((key) => key.startsWith('Ebilet'))
      .map((key) => ({ key, value: EBilets[key as keyof typeof EBilets] }))
      .sort((a, b) => {
        const numA = parseInt(a.key.replace('Ebilet', ''), 10);
        const numB = parseInt(b.key.replace('Ebilet', ''), 10);
        return numA - numB;
      })
      .map((item) => item.value);
  }
}
