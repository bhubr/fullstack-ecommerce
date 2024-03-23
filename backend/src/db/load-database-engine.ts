import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type {
  DatabaseEngine,
  DatabaseEngineModule,
  DbMigrateConfig,
} from './types';

async function readJSONAsync<T>(file: string): Promise<T> {
  const data = await readFile(file, 'utf-8');
  return JSON.parse(data) as T;
}

async function readDbMigrateConfig(): Promise<DbMigrateConfig> {
  const dbMigrateConfigPath = resolve(__dirname, '..', 'database.json');
  return readJSONAsync<DbMigrateConfig>(dbMigrateConfigPath);
}

async function loadDatabaseEngine(
  environment: string
): Promise<DatabaseEngine> {
  const databaseConfigs = await readDbMigrateConfig(); // Assuming you have a property in your config for the database engine
  const dbConfig = databaseConfigs[environment];
  let dbModule: DatabaseEngineModule;

  if (dbConfig.driver === 'sqlite3') {
    dbModule = await import('./sqlite3'); // Dynamic import for SQLite3 module
    //   } else if (dbConfig.engine === 'pg') {
    //     dbModule = await import('./pg') as unknown as DatabaseEngineModule;; // Dynamic import for PostgreSQL module
  } else {
    throw new Error('Unsupported database engine');
  }

  return dbModule.default; // Assuming your module exports a default DatabaseEngine instance
}

export default loadDatabaseEngine;
