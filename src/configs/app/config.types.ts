export type TAppConfiguration = {
  env: string;
  port: number;
  corsWhitelist: string;
};

// TODO: make it global
export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}
