import { ISendMailOptions } from '@nestjs-modules/mailer';

export type SendNotificationsOptions = Pick<
  ISendMailOptions,
  'template' | 'context' | 'attachments'
>;

export type NotificationsOptions = {
  recipient: string;
  subject: string;
  options: SendNotificationsOptions;
};

export type SMSNotificationsOptions = {
  messsage: string;
  gsmno: string;
};


export type SMSBusMessage = {
  pnrNumber: string;
  userPhoneNumber: string;
  busCompany: string;
  departureTerminal: string;
  arrivalTerminal: string;
  departureDate: string;
  departureTime: string;
  seatNumber: string;
};


export type SMSPlaneMessage = {
  pnrNumber: string;
  userPhoneNumber: string;
  airlineName: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  flightNumber: string;
};