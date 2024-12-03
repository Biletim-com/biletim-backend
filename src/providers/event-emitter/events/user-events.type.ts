import {
  SendVerifyAccountEmailNotificationDto
} from '@app/common/dtos';

export type UserEventsMap = {
  'user.created': SendVerifyAccountEmailNotificationDto;
  'user.email.updated': SendVerifyAccountEmailNotificationDto;
  'user.password.reset': SendVerifyAccountEmailNotificationDto;
};
