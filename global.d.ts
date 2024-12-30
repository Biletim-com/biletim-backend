type Nullable<T> = T | null;

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    BACKEND_URL: string;
    LOG_LEVEL: 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';
    JWT_SECRET: string;
    RESET_PASSWORD_URL: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
    SUPER_ADMIN_KEY: string;

    // services
    CHOROMIUM_HOST: string;
    CHOROMIUM_PORT: string;

    // db
    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_DB: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;

    MONGO_USER: string;
    MONGO_PASSWORD: string;
    MONGO_HOST: string;
    MONGO_PORT: string;
    MONGO_DB: string;

    // queue
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD: string;

    // ticket
    BILETALL_BASE_URI: string;
    BILETALL_PASSWORD: string;
    BILETALL_USERNAME: string;

    // hotel
    HOTEL_API_BASE_URL: string;
    HOTEL_WS_USERNAME: string;
    HOTEL_WS_PASSWORD: string;

    // payment
    VAKIF_BANK_VPOS_BASE_URI: string;
    VAKIF_BANK_3DS_BASE_URI: string;
    VAKIF_BANK_MERCHANT_ID: string;
    VAKIF_BANK_MERCHANT_PASSWORD: string;
    VAKIF_BANK_TERMINAL_NO: string;

    GARANTI_VPOS_BASE_URI: string;
    GARANTI_SWITCH_ID: string;
    GARANTI_SWITCH_PASSWORD: string;

    BILETALL_3DS_BASE_URI: string;

    // notification
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
    EMAIL_PORT: string;
    EMAIL_HOST: string;
    EMAIL_USE_SSL: string;
    EMAIL_FROM: string;
    NETGSM_BASE_URL: string;
    NETGSM_USERNAME: string;
    NETGSM_PASSWORD: string;
    NETGSM_APP_KEY: string;
  }
}
