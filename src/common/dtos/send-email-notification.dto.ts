export class SendVerifyAccountEmailNotificationDto {
  recipient: string;
  verificationCode?: number;
  forgotPasswordCode?: string;
}
