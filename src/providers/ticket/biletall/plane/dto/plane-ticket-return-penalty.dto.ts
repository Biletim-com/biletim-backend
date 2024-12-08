import { PlaneTicketReturnPenaltyPassenger } from '../types/bilatall-plane-ticket-return-penalty.type';

export class PlaneTicketReturnPenaltyPassengerDto {
  ticketNumber: string;
  firstName: string;
  lastName: string;
  ticketPrice: string;
  providerPenaltyAmount: string; // komisyon -> needs to be biletAll + biletim
  companyPenaltyAmount: string;
  isFeePenalty: boolean;
  totalPenaltyAmount: string;
  amountToRefund: string;
}

export class PlaneTicketReturnPenaltyDto {
  pnrNumber: string;
  passengers: PlaneTicketReturnPenaltyPassengerDto[];

  private sanitizeAmount(value: string): string {
    return value.replace(/,/g, '.');
  }

  constructor(
    pnrNumber: string,
    passenger: PlaneTicketReturnPenaltyPassenger[],
  ) {
    this.pnrNumber = pnrNumber;
    this.passengers = passenger.map((passenger) => ({
      ticketNumber: passenger.EBiletNo,
      firstName: passenger.Ad,
      lastName: passenger.Soyad,
      ticketPrice: this.sanitizeAmount(passenger.Tutar),
      providerPenaltyAmount: this.sanitizeAmount(passenger.Komisyon),
      companyPenaltyAmount: this.sanitizeAmount(passenger.FirmaCeza),
      isFeePenalty: passenger.KomisyonCezaliMi === '1',
      totalPenaltyAmount: this.sanitizeAmount(passenger.ToplamCeza),
      amountToRefund: this.sanitizeAmount(passenger.OlusanAcikPara),
    }));
  }
}
