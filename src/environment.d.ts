declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            SITE_ORIGIN: string;
            PORT: string;
            EMAIL_ADDRESS: string;
            EMAIL_PASSWORD: string;
        }
    }
}

export {}
