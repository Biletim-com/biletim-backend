import { Job } from 'bull';
import { NotificationsOptions } from '../types/send-notifications-options.type';

export interface INotificationProccessor {
  send(job: Job<NotificationsOptions>): Promise<void>;
}
