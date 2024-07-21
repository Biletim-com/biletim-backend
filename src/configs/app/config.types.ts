export type TAppConfiguration = {
  env: string;
  port: number;
  corsWhitelist: string;
  biletAllUsername: string;
  biletAllPassword: string;
  biletAllURI: string;
};

// TODO: make it global
export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}
