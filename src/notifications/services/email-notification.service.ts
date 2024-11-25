import { Injectable, Logger } from '@nestjs/common';

import { SendVerifyAccountEmailNotificationDto } from '@app/common/dtos/send-email-notification.dto';
import { OnEvent, OnEvents } from '@app/providers/event-emitter/decorators';

import { AuthConfigService } from '@app/configs/auth';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailNotificationService {
  private readonly logger = new Logger(EmailNotificationService.name);

  constructor(
    @InjectQueue('emailQueue')
    private readonly queue: Queue,
    private readonly authConfigService: AuthConfigService,
  ) {}

  @OnEvents(['user.created', 'user.email.updated'])
  async sendSetupProfileEmail({
    recipient,
    verificationCode,
  }: SendVerifyAccountEmailNotificationDto): Promise<void> {
    this.logger.log(`sendSetupProfileEmail is called with ${verificationCode}`);
    try {
      await this.queue.add({
        recipient: recipient,
        subject: 'Email Verification',
        options: {
          template: 'verify-email',
          context: {
            header: 'Email Verification',
            content: 'Verification code',
            verificationCode,
          },
        },
      });
    } catch (err) {
      this.logger.log(`sendSetupProfileEmail is ERRORED: ${err}`);
    }
  }

  @OnEvent('user.password.reset')
  async sendResetPasswordEmail({
    recipient,
    forgotPasswordCode,
  }: SendVerifyAccountEmailNotificationDto): Promise<void> {
    this.logger.log(
      `sendResetPasswordEmail is called with ${forgotPasswordCode}`,
    );
    try {
      await this.queue.add({
        recipient: recipient,
        subject: 'Password reset',
        options: {
          template: 'reset-password',
          context: {
            header: 'Password reset',
            content: 'Click the button below to reset your password.',
            url: `${this.authConfigService.resetPasswordUrl}?verificationCode=${forgotPasswordCode}`,
          },
        },
      });
    } catch (err) {
      this.logger.log(`sendResetPasswordEmail is ERRORED: ${err}`);
    }
  }
}
