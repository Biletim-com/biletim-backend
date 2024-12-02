export class SendSmsNotificationDto {
  messsage: string;
  gsmno: string;
}

export class SendSmsVerificationDto {
  verificationCode: string;
  gsmno: string;
}
