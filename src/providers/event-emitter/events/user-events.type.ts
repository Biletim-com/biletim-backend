import {
  SendVerifyAccountEmailNotificationDto
} from '@app/common/dtos';
import { SendSmsNotificationDto, SendSmsVerificationDto } from '@app/common/dtos/send-sms-notification.dto';

export type UserEventsMap = {
  'user.created': SendVerifyAccountEmailNotificationDto;
  'user.email.updated': SendVerifyAccountEmailNotificationDto;
  'user.password.reset': SendVerifyAccountEmailNotificationDto;
  'user.sms': SendSmsNotificationDto;
  'user.verification.code': SendSmsVerificationDto;
};
