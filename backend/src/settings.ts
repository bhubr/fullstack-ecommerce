import dotenv from 'dotenv';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
dotenv.config();

export const pgSettings = {
  username: process.env.PG_USERNAME ?? 'test',
  password: process.env.PG_PASSWORD ?? 'test',
  database: process.env.PG_DATABASE ?? 'test',
  host: process.env.PG_HOST ?? 'localhost',
}