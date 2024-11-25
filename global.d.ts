type Nullable<T> = T | null;

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    BACKEND_URL: string;
    LOG_LEVEL: 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';
    JWT_SECRET: string;
    RESET_PASSWORD_URL: string;
    BILETALL_BASE_URI: string;
    BILETALL_3DSECURE_BASE_URI: string;
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
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
    EMAIL_PORT: string;
    EMAIL_HOST: string;
    PAYMENT_VPOS_BASE_URI: string;
    PAYMENT_3DSECURE_BASE_URI: string;
    PAYMENT_MERCHANT_ID: string;
    PAYMENT_TERMINAL_NO: string;
    PAYMENT_MERCHANT_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;
  }
}
