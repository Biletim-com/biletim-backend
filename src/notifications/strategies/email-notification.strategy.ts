// import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

// import { INotificationStrategy } from '../interfaces/notification.interface';
// import { SendNotificationsOptions } from '../types/send-notifications-options.type';

// @Injectable()
// export class EmailNotificationStrategy implements INotificationStrategy {
//   constructor(private readonly mailerService: MailerService) {}

//   send(
//     recipient: string,
//     subject: string,
//     options: SendNotificationsOptions,
//   ): Promise<void> {
//     return this.mailerService.sendMail({
//       to: recipient,
//       subject,
//       ...options,
//     });
//   }
// }

import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('emailQueue')
export class EmailProcessor {
  constructor(private readonly mailerService: MailerService) {}
  
  @Process('sendEmail')
  async handleSendEmail(job: Job) {
    const { recipient, subject, options } = job.data;
    return this.mailerService.sendMail({
      to: recipient,
      subject,
      ...options,
    });
  }
}