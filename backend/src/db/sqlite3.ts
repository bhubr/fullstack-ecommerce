import sqlite3 from 'sqlite3';
import { SQLite3DatabaseEngine, Scalar } from './types';
// import { resolve } from 'path';
// import { dbFile } from './settings';

// const sqlite3 = sqlite3module.verbose();
// const dbFilePath = resolve(__dirname, '..', dbFile);
// const db = new sqlite3.Database(dbFilePath);

const sqlite3db: SQLite3DatabaseEngine = {
  /**
   * The SQLite3 database instance
   */
  db: undefined, 

  /**
   * Initializes the SQLite3 database engine
   * @param file The file path to the SQLite3 database
   */
  async initialize(file: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(file, (err) => {
        if (err instanceof Error) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Executes a query against the SQLite3 database
   * @param sql The SQL query to execute
   * @param args The arguments to pass to the query
   * @returns The result of the query
   */
  async query<T = void>(
    sql: string,
    args: Scalar[]
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      // We trust that this.db is defined because
      // it's the first thing we do when we initialize the app
      const stmt = this.db!.prepare(sql);
      stmt.all(...args, (err: Error, rows: T) => {
        if (err instanceof Error) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
};

export default sqlite3db;


// export async function insertIntoTable<U, V>(
//   table: string,
//   payload: U
// ): Promise<V> {
//   const typedPayload = payload as Record<string, Scalar>;
//   const columns = Object.keys(typedPayload);
//   const values = Object.values(typedPayload);
//   const placeholders = new Array(columns.length).fill('?');
//   const sql = `INSERT INTO ${table}
//       (${columns.join(', ')})
//     VALUES
//       (${placeholders.join(', ')})`;
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
//   await queryAsync(sql, ...values);
//   const rows = await queryAsync<[{ id: number }]>(
//     'SELECT last_insert_rowid() as id'
//   );
//   const [{ id }] = rows;
//   // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
//   const record = { id, ...payload } as V;
//   return record;
// }

// export async function getFromTableByField<T>(
//   table: string,
//   field: string,
//   value: Scalar
// ): Promise<T> {
//   const rows = await queryAsync<T[]>(
//     `SELECT * FROM ${table} WHERE ${field} = ?`,
//     value
//   );
//   return rows[0];
// }

// export async function insertUser(payload: IUserDTO): Promise<IUser> {
//   const existingUser = await getFromTableByField<IUser>(
//     'user',
//     'email',
//     payload.email
//   );
//   if (existingUser !== undefined) {
//     throw new Error('User with this email already exists');
//   }
//   return insertIntoTable<IUserDTO, IUser>('user', payload);
// }

// export async function insertPad(payload: IPadDTO): Promise<IPad> {
//   await queryAsync(
//     `INSERT INTO pad (title, content, createdAt, updatedAt)
//     VALUES (?, ?, ?, ?)`,
//     payload.title,
//     payload.content,
//     payload.createdAt,
//     payload.updatedAt
//   );
//   const rows = await queryAsync<[{ id: number }]>(
//     'SELECT last_insert_rowid() as id'
//   );
//   return { id: rows[0].id, ...payload };
// }
