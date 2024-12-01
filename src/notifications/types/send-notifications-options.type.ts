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
