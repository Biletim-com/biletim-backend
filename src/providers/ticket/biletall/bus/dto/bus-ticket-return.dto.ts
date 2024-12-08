import { BusTicketReturn } from '../types/biletall-bus-ticket-return.type';

export class BusTicketReturnDto {
  result: boolean;
  amount: string;

  constructor(ticketReturn: BusTicketReturn) {
    this.result = ticketReturn.Sonuc === 'true';
    this.amount = ticketReturn.Tutar.split('-')[1];
  }
}
