type Attachment = {
  filename: string;
  content: Buffer;
  contentType: 'application/pdf';
};

type PlanePassenger = {
  passengerFullName: string;
  tcNumber: string;
  ticketNumber: string;
  pnrNumber: string;
};

type BusPassenger = {
  passengerFullName: string;
  tcNumber: string;
  pnrNumber: string;
  seatNumber: string;
  amount: string;
  gender: 'Erkek' | 'Kadın';
};

type Flight = {
  airlineCompany: string;
  departureAirportCode: string;
  departureAirportName: string;
  departureAirportCity: string;
  arrivalAirportCode: string;
  arrivalAirportName: string;
  arrivalAirportCity: string;
  flightNumber: string;
  flightClass: string;
  flightClassType: string;
  flightClassName: string;
  flightDuration: string;
  luggageAllowance?: Nullable<string>;
  cabinLuggageAllowance?: Nullable<string>;
  luggageAllowanceDetails: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
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
  companyLogo: string;
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

export type SendPlaneTicketGeneratedEmailNotication = {
  recipient: string;
  ticketTemplateData: PlaneTicketEmailTemplateData;
  attachments: Attachment[];
};
