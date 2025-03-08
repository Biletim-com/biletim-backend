export type TPostgreSQLConfiguration = {
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
  logging: boolean;
  ssl: boolean;
};
