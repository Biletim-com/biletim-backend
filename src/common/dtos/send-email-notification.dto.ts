export class SendVerifyAccountEmailNotificationDto {
  recipient: string;
  verificationCode?: number;
  forgotPasswordCode?: string;
}

export class SendSmsNotificationDto {
  messsage: string;
  gsmno: string;
}
