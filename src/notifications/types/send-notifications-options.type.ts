import { ISendMailOptions } from '@nestjs-modules/mailer';

export type SendNotificationsOptions = Pick<
  ISendMailOptions,
  'template' | 'context'
>;
