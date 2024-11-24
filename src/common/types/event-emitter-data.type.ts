type Attachment = {
  filename: string;
  content: Buffer;
  contentType: 'application/pdf';
};

type PlanePassenger = {
  passengerFullName: string;
  ticketNumber: string;
  pnrNumber: string;
};

type BusPassenger = {
  passengerFullName: string;
  seatNumber: string;
  amount: string;
  pnrNumber: string;
  gender: string;
  tcNumber: string;
};

type Flight = {
  airlineCompany: string;
  departureAirport: string;
  arrivalAirport: string;
  flightNumber: string;
  flightClassType: string;
  flightClassName: string;
  luggageAllowance?: Nullable<string>;
  cabinLuggageAllowance?: Nullable<string>;
  luggageAllowanceDetails: string;
  departureDateTime: string;
  arrivalDateTime: string;
  flightDuration: string;
  pnrNumber: string;
};

type BusTrip = {
  busCompany: string;
  departureTerminal: string;
  arrivalTerminal: string;
  departureDate: string;
  departureTime: string;
};

export type BusTicketEmailTemplateData = {
  pnrNumber: string;
  trip: BusTrip;
  passengers: BusPassenger[];
};

export type PlaneTicketEmailTemplateData = {
  passengers: PlanePassenger[];
  airlineCompany: string;
  pnrNumber: string;
  importantNote?: string;
  departureFlights: Flight[];
  returnFlights?: Flight[];
};

export type SendVerifyAccountEmailNotification = {
  recipient: string;
  verificationCode: number;
  forgotPasswordCode?: string;
};

export type SendResetPasswordEmailNotification = {
  recipient: string;
  forgotPasswordCode: string;
};

export type SendBusTicketGeneratedEmailNotication = {
  recipient: string;
  ticketTemplateData: BusTicketEmailTemplateData;
  attachments: Attachment[];
};

export type SendPlaneTicketGeneratedEmailNotication = {
  recipient: string;
  ticketTemplateData: PlaneTicketEmailTemplateData;
  attachments: Attachment[];
};
