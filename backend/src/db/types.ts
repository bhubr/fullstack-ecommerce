import sqlite3 from 'sqlite3';

export type Scalar = string | number | boolean | null;

export interface DatabaseEngine {
  initialize(fileOrUrl: string): Promise<void>;
  query<T>(sql: string, args: Scalar[]): Promise<T>;
}

export interface SQLite3DatabaseEngine extends DatabaseEngine {
  db?: sqlite3.Database;
}

export type DatabaseEngineModule = {
  default: DatabaseEngine;
};

// export type DbMigrateConfigValue = string | { ENV: string };
// export type DbMigrateConfig = Record<string, Record<string, DbMigrateConfigValue>>;

type DatabaseDriver = 'sqlite3' | 'pg' | 'mysql';
// Define a common structure for database configurations

export interface DatabaseConfigBase {
  driver: DatabaseDriver;
  [key: string]: string | number | boolean | undefined; // Allow other properties
}

// Define a mapped type to ensure each configuration object contains a driver key
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConfigWithDriver<T extends Record<string, any>> = {
  [K in keyof T]: T[K] & { driver: DatabaseDriver };
};

// Define the type for the entire configuration object
export type DbMigrateConfig = ConfigWithDriver<Record<string, DatabaseConfigBase>>;

export interface DbMigrateConfigWrapper {
  dbConfig: DatabaseConfigBase;
  connectionString: string;
}