import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type {
  DatabaseConfigBase,
  DbMigrateConfig,
  DbMigrateConfigWrapper,
} from './types';

async function readJSONAsync<T>(file: string): Promise<T> {
  const data = await readFile(file, 'utf-8');
  return JSON.parse(data) as T;
}

async function readDbMigrateConfig(): Promise<DbMigrateConfig> {
  const dbMigrateConfigPath = resolve(__dirname, '..', '..', 'database.json');
  return readJSONAsync<DbMigrateConfig>(dbMigrateConfigPath);
}

async function loadDatabaseConfig(
  environment: string
): Promise<DbMigrateConfigWrapper> {
  const databaseConfigs = await readDbMigrateConfig(); // Assuming you have a property in your config for the database engine
  const dbConfig = databaseConfigs[environment] as DatabaseConfigBase;
  if (dbConfig === undefined) {
    throw new Error(
      `Database configuration for environment ${environment} not found`
    );
  }
  if (dbConfig.driver === undefined) {
    throw new Error(
      `Database configuration for environment ${environment} does not have a driver`
    );
  }
  const { driver, ...rest } = dbConfig;
  const parsedConfig: DatabaseConfigBase = {
    driver,
  };
  for (const key in rest) {
    const value = rest[key];
    if (value === null || value === undefined) {
      throw new Error(
        `Database configuration for environment ${environment} does not have a ${key} value`
      );
    }
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      parsedConfig[key] = value;
    }
    if (value['ENV'] !== undefined) {
      parsedConfig[key] = process.env[value['ENV']] as string;
    }
  }

  let connectionString: string;
  if (parsedConfig.driver === 'sqlite3') {
    connectionString = parsedConfig.filename as string;
  }
  if (parsedConfig.driver === 'pg') {
    // build connection string URL for pg from dbConfig bits
    const { user, password, database, port, host } = parsedConfig;
    // connectionString = `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
    connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }

  return { dbConfig: parsedConfig, connectionString };
}

export default loadDatabaseConfig;
