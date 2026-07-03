import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
    "PORT",
    "DATABASE_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET"
];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
});

export const env = {
    PORT: process.env.PORT,

    NODE_ENV: process.env.NODE_ENV,

    DATABASE_URL: process.env.DATABASE_URL,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,

    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,

    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,

    SMTP_HOST: process.env.SMTP_HOST,

    SMTP_PORT: process.env.SMTP_PORT,

    SMTP_USER: process.env.SMTP_USER,

    SMTP_PASS: process.env.SMTP_PASS,

    EMAIL_FROM: process.env.EMAIL_FROM,

    CLIENT_URL: process.env.CLIENT_URL
};