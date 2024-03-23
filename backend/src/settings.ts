import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT ?? 5000;

export const dbFileOrUrl = process.env.DATABASE_URL ?? 'mypad-dev.sqlite3';

export const jwtSecret = process.env.JWT_SECRET ?? 'secret';

export const environment = process.env.NODE_ENV ?? 'development';
console.log('Environment:', environment);

export const isProduction = environment === 'production';
