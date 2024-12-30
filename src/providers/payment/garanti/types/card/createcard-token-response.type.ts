import { ErrorResponseHeader, SuccessfulResponseHeader } from '../headers.type';

export type CreateCardTokenSuccessResponse = {
  header: SuccessfulResponseHeader;
  card: {
    token: string;
    binNumber: string;
    bankId: string;
    maskedNumber: string;
    bankName: string;
  };
};

export type DeleteCardTokenSuccessResponse = {
  header: SuccessfulResponseHeader;
};

export type CardTokenErrorResponse = {
  header: ErrorResponseHeader;
  errorMap?: {
    [key: string]: string;
  };
};

export type CardTokenResponse =
  | CreateCardTokenSuccessResponse
  | DeleteCardTokenSuccessResponse
  | CardTokenErrorResponse;
