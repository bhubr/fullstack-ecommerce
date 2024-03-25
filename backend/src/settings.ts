import { resolve } from 'node:path';
import dotenv from 'dotenv';
// import dumpEnvironmentVars from './helpers/dump-environment-vars';

dotenv.config();

export const port = process.env.PORT ?? 5000;

export const dbFileOrUrl =
  process.env.DATABASE_URL ?? 'app-development.sqlite3';

export const jwtSecret = process.env.JWT_SECRET ?? 'secret';

export const environment = process.env.NODE_ENV ?? 'development';
console.log('Environment:', environment);

export const isProduction = environment === 'production';

export const staticImagesParent = resolve(__dirname, '..', 'static');

// Onlly relevant in development
const clientOriginFallback = isProduction ? '' : 'http://localhost:5173';
export const clientOrigin = process.env.CLIENT_ORIGIN ?? clientOriginFallback;
export const corsEnabled = clientOrigin !== '';
console.log('Client origin:', clientOrigin);
console.log('CORS enabled:', corsEnabled);

// dumpEnvironmentVars(
//   {
//     NODE_ENV: 'environment',
//     JWT_SECRET: 'jwtSecret',
//     DATABASE_URL: 'dbFileOrUrl',
//     CLIENT_ORIGIN: 'clientOrigin',
//   },
//   ['JWT_SECRET', 'DATABASE_URL']
// );
