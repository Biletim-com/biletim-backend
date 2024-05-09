export const AUTH_STRATEGY_TOKEN = 'AuthStrategy';

export interface UserResponse {
  id: string;
  sub: string;
  name: string;
  family_name: string;
  email: string;
}

export interface AuthStrategy {
  validate(accessToken: string): Promise<UserResponse>;
}
