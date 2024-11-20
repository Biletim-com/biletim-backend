import { ISendMailOptions } from '@nestjs-modules/mailer';

export type SendNotificationsOptions = Pick<
  ISendMailOptions,
  'template' | 'context'
>;


export type NotificationsOptions = {
  recipient: string,
  subject: string,
  options: SendNotificationsOptions
}