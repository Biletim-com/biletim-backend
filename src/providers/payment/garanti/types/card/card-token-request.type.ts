import { RequestHeader } from '../headers.type';

export type CreateCardTokenRequest = {
  header: RequestHeader;
  additionalData: string;
  registrationType: 'F';
  card: {
    number: string;
    expireMonth: string;
    expireYear: string;
  };
};

export type DeleteCardTokenRequest = {
  header: RequestHeader;
  card: {
    token: string;
  };
};

export type CartTokenRequest = CreateCardTokenRequest | DeleteCardTokenRequest;
