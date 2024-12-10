import { DateTime } from '@app/common/types';

type CommonHeader = {
  requestId: string;
  swtId: string;
  timestamp: DateTime;
  hashedData: string;
};

export type RequestHeader = CommonHeader & {
  userId: string;
};

export type ErrorResponseHeader = CommonHeader & {
  returnCode: string;
  reasonCode: string;
  message: string;
};

export type SuccessfulResponseHeader = CommonHeader & {
  returnCode: '00';
  reasonCode: '00';
  message: string;
};
