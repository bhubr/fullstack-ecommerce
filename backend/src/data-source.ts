import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { pgSettings } from './settings';
import { User } from './entity/User';

const { username, password, database, host } = pgSettings;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AppDataSource = new DataSource({
  type: 'postgres',
  host,
  port: 5432,
  username,
  password,
  database,
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
