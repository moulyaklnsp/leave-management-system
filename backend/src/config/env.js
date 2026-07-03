import dotenv from "dotenv";

dotenv.config();

const requiredVariables = [
  "PORT",
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

requiredVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Missing environment variable: ${variable}`);
  }
});

const env = {
  PORT: Number(process.env.PORT),

  NODE_ENV: process.env.NODE_ENV,

  DATABASE_URL: process.env.DATABASE_URL,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,

  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,

  CLIENT_URL: process.env.CLIENT_URL,

  SMTP_HOST: process.env.SMTP_HOST,

  SMTP_PORT: Number(process.env.SMTP_PORT),

  SMTP_USER: process.env.SMTP_USER,

  SMTP_PASS: process.env.SMTP_PASS,

  EMAIL_FROM: process.env.EMAIL_FROM,
};

export default env;