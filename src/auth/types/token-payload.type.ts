import { UUID } from '@app/common/types';

export type AccessTokenPayload = {
  sub: UUID;
  name: string;
  middleName?: string;
  familyName: string;
  email: string;
  type: 'access';
};

export type RefreshTokenPayload = {
  sub: string;
  type: 'refresh';
};
