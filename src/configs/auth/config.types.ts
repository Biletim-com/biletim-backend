export type TAuthConfiguration = {
  jwtSecret: string;
  bcryptSaltRounds: number;
  resetPasswordUrl: string;
};
