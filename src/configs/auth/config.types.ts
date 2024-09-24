export type TAuthConfiguration = {
  jwtSecret: string;
  jwtExpiration: number;
  bcryptSaltRounds: number;
  resetPasswordUrl: string;
};
