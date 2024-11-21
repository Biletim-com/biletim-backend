import { Order } from '@app/modules/orders/order.entity';

export type SendVerifyAccountEmailNotification = {
  recipient: string;
  verificationCode: number;
  forgotPasswordCode?: string;
};

export type SendResetPasswordEmailNotification = {
  recipient: string;
  forgotPasswordCode: string;
};

export type SendTicketPurchaseEmailNotication = {
  recipient: string;
  order: Order;
};
