import sqlite3 from 'sqlite3';
import {
  DatabaseEngine,
  IGetAllFromTableOptions,
  IGetAllFromTableResult,
  Scalar,
} from './types';

interface SQLite3DatabaseEngine extends DatabaseEngine {
  db?: sqlite3.Database;
}

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
      const sqlite3m = sqlite3.verbose();
      this.db = new sqlite3m.Database(file, (err) => {
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
  async query<T>(sql: string, args: Scalar[]): Promise<T> {
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

  /**
   * Get all from table
   */
  async getAllFromTable<T>(
    table: string,
    options: IGetAllFromTableOptions = {}
  ): Promise<IGetAllFromTableResult<T>> {
    const { offset, limit, where = [] } = options;
    let query = `SELECT * FROM ${table}`;
    const args: Scalar[] = [];
    let whereClause = '';
    if (where.length > 0) {
      whereClause = where
        .map(([field, operator]) => `${field} ${operator} ?`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      args.push(...where.map(([, , value]) => value));
    }
    let allArgs = [...args];
    if (limit !== undefined && offset !== undefined) {
      query += ` LIMIT ? OFFSET ?`;
      allArgs = [...args, limit, offset];
    }
    // Get all records matching the query between the offset and limit
    console.log('>> query', query);
    const records = await this.query(query, allArgs);
    // Fire another query to get the total count of records matching the where clause
    let countQuery = `SELECT COUNT(*) as count FROM ${table}`;
    if (where.length > 0) {
      countQuery += ` WHERE ${whereClause}`;
    }
    console.log('>> countQuery', countQuery);
    const [{ count }] = await this.query(countQuery, args);
    // Return the records and the total count
    return { records, count };
  },

  /**
   * Insert into table
   */
  async insertIntoTable<T>(
    table: string,
    payload: Record<string, Scalar>
  ): Promise<T> {
    const typedPayload = payload as Record<string, Scalar>;
    const columns = Object.keys(typedPayload);
    const values = Object.values(typedPayload);
    const placeholders = new Array(columns.length).fill('?');
    const sql = `INSERT INTO ${table}
        (${columns.join(', ')})
      VALUES
        (${placeholders.join(', ')})`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.query(sql, values);
    const rows = await this.query('SELECT last_insert_rowid() as id', []);
    const [{ id }] = rows;
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const record = { id, ...payload } as T;
    return record;
  },

  /**
   * Get one from table by field
   */
  async getOneFromTableByField<T>(
    table: string,
    field: string,
    value: Scalar
  ): Promise<T> {
    const [record] = await this.query(
      `SELECT * FROM ${table} WHERE ${field} = ?`,
      [value]
    );
    return record;
  },
};

export default sqlite3db;

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
