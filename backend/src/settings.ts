import { resolve } from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

export const port = process.env.PORT ?? 5000;

export const dbFileOrUrl = process.env.DATABASE_URL ?? 'app-development.sqlite3';

export const jwtSecret = process.env.JWT_SECRET ?? 'secret';

export const environment = process.env.NODE_ENV ?? 'development';
console.log('Environment:', environment);

export const isProduction = environment === 'production';

export const staticImagesParent = resolve(__dirname, '..', 'static');

// Onlly relevant in development
export const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';