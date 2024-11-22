type Attachment = {
  filename: 'ticket.pdf';
  content: Uint8Array;
  contentType: 'application/pdf';
};

export type SendVerifyAccountEmailNotification = {
  recipient: string;
  verificationCode: number;
  forgotPasswordCode?: string;
};

export type SendResetPasswordEmailNotification = {
  recipient: string;
  forgotPasswordCode: string;
};

export type SendTicketGeneratedEmailNotication = {
  recipient: string;
  attachments: Attachment[];
};
