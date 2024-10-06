import { SendNotificationsOptions } from '../types/send-notifications-options.type';

export interface INotificationStrategy {
  send(
    recipient: string,
    subject: string,
    options: SendNotificationsOptions,
  ): Promise<void>;
}
