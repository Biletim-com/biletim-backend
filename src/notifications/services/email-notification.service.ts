import { Injectable } from '@nestjs/common';

import { SendVerifyAccountEmailNotificationDto } from '@app/common/dtos/send-email-notification.dto';
import { OnEvent, OnEvents } from '@app/providers/event-emitter/decorators';

import { EmailNotificationStrategy } from '../strategies/email-notification.strategy';
import { AuthConfigService } from '@app/configs/auth';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class EmailNotificationService {
  constructor(
    private readonly notification: EmailNotificationStrategy,
    private readonly authConfigService: AuthConfigService,
    @InjectQueue('queue') private readonly queue: Queue
  ) { }

  @OnEvents(['user.created', 'user.email.updated'])
  async sendSetupProfileEmail({
    recipient,
    verificationCode,
  }: SendVerifyAccountEmailNotificationDto): Promise<void> {
    await this.queue.add('verifyEmail', {
      recipient: recipient, subject: 'Email Verification', options: {
        template: 'verify-email',
        context: {
          header: 'Email Verification',
          content: 'Verification code',
          verificationCode,
        },
      }
    });
    // await this.notification.send(recipient, 'Email Verification', {
    //   template: 'verify-email',
    //   context: {
    //     header: 'Email Verification',
    //     content: 'Verification code',
    //     verificationCode,
    //   },
    // });
  }

  @OnEvent('user.password.reset')
  async sendResetPasswordEmail({
    recipient,
    forgotPasswordCode,
  }: SendVerifyAccountEmailNotificationDto): Promise<void> {
    await this.queue.add('resetPassword', {recipient: recipient, subject:'Password reset', options: {
      template: 'reset-password',
      context: {
        header: 'Password reset',
        content: 'Click the button below to reset your password.',
        url: `${this.authConfigService.resetPasswordUrl}?verificationCode=${forgotPasswordCode}`,
      },
    }});
    // await this.notification.send(recipient, 'Password reset', {
    //   template: 'reset-password',
    //   context: {
    //     header: 'Password reset',
    //     content: 'Click the button below to reset your password.',
    //     url: `${this.authConfigService.resetPasswordUrl}?verificationCode=${forgotPasswordCode}`,
    //   },
    // });
  }
}
