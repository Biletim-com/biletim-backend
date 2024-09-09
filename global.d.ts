type Nullable<T> = T | null;

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    LOG_LEVEL: 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';
    JWT_SECRET: string;
    RESET_PASSWORD_URL: string;
    BILETALL_WSDL_URI: string;
    BILETALL_WS_USERNAME: string;
    BILETALL_WS_PASSWORD: string;
    HOTEL_API_BASE_URL: string;
    HOTEL_WS_USERNAME: string;
    HOTEL_WS_PASSWORD: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
    SUPER_ADMIN_KEY: string;
  }
}
