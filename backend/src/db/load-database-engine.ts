import type {
  DatabaseConfigBase,
  DatabaseEngine,
  DatabaseEngineModule,
} from './types';

async function loadDatabaseEngine(
  dbConfig: DatabaseConfigBase
): Promise<DatabaseEngine> {
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
