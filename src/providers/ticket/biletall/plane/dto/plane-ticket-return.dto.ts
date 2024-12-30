import { PlaneTicketReturn } from '../types/bilatall-plane-ticket-return.type';

export class PlaneTicketReturnDto {
  result: boolean;
  amount: string;

  constructor(ticketReturn: PlaneTicketReturn) {
    this.result = ticketReturn.Sonuc === 'true';
    this.amount = ticketReturn.Tutar.split('-')[1];
  }
}
