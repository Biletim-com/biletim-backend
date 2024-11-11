import { Injectable } from '@nestjs/common';

import { SendVerifyAccountEmailNotificationDto } from '@app/common/dtos/send-email-notification.dto';
import { OnEvent, OnEvents } from '@app/providers/event-emitter/decorators';

import { EmailNotificationStrategy } from '../strategies/email-notification.strategy';
import { AuthConfigService } from '@app/configs/auth';

@Injectable()
export class EmailNotificationService {
  constructor(
    private readonly notification: EmailNotificationStrategy,
    private readonly authConfigService: AuthConfigService,
  ) {}

  @OnEvents(['user.created', 'user.email.updated'])
  async sendSetupProfileEmail({
    recipient,
    verificationCode,
  }: SendVerifyAccountEmailNotificationDto): Promise<void> {
    this.notification.send(recipient, 'Email Verification', {
      template: 'verify-email',
      context: {
        header: 'Email Verification',
        content: 'Verification code',
        verificationCode,
      },
    });
  }

  @OnEvent('user.password.reset')
  async sendResetPasswordEmail({
    recipient,
    forgotPasswordCode,
  }: SendVerifyAccountEmailNotificationDto): Promise<void> {
    this.notification.send(recipient, 'Password reset', {
      template: 'reset-password',
      context: {
        header: 'Password reset',
        content: 'Click the button below to reset your password.',
        url: `${this.authConfigService.resetPasswordUrl}?verificationCode=${forgotPasswordCode}`,
      },
    });
  }
}
