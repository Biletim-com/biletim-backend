import { Job } from 'bull';
import {
  NotificationsOptions,
  SMSNotificationsOptions,
} from '../types/send-notifications-options.type';

export interface INotificationProccessor {
  send(job: Job<NotificationsOptions | SMSNotificationsOptions>): Promise<void>;
}
