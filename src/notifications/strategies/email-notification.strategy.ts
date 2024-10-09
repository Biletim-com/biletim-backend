import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { INotificationStrategy } from '../interfaces/notification.interface';
import { SendNotificationsOptions } from '../types/send-notifications-options.type';

@Injectable()
export class EmailNotificationStrategy implements INotificationStrategy {
  constructor(private readonly mailerService: MailerService) {}

  send(
    recipient: string,
    subject: string,
    options: SendNotificationsOptions,
  ): Promise<void> {
    return this.mailerService.sendMail({
      to: recipient,
      subject,
      ...options,
    });
  }
}
