import { FlightTicketReservationResult } from '../types/biletall-plane-ticket-reservation.type';

export class FlightTicketReservationDto {
  result: boolean;
  pnr: string;
  message?: string;
  error?: string;
  reservationValidityTime: string;

  constructor({
    Sonuc,
    PNR,
    Hata,
    Mesaj,
    RezervasyonOpsiyon,
  }: FlightTicketReservationResult) {
    this.result = Sonuc === 'true';
    this.pnr = PNR;
    this.message = Mesaj;
    this.error = Hata;
    this.reservationValidityTime = RezervasyonOpsiyon;
  }
}
