import loadDatabaseConfig from '../db/load-database-config';
import loadDatabaseEngine from '../db/load-database-engine';
import { DatabaseEngine } from '../db/types';
import { environment } from '../settings';

// Define a database service class
class DatabaseService {
    private static instance: DatabaseService | null = null;
    private db: DatabaseEngine | null = null;

    private constructor() {}

    public static async getInstance(): Promise<DatabaseService> {
        if (!DatabaseService.instance) {
            const instance = new DatabaseService();
            const { dbConfig, connectionString } = await loadDatabaseConfig(environment);
            instance.db = await loadDatabaseEngine(dbConfig); // Load the database engine
            await instance.db.initialize(connectionString); // Initialize the database engine
            DatabaseService.instance = instance;
        }
        return DatabaseService.instance;
    }

    public getDB(): DatabaseEngine {
        if (!this.db) {
            throw new Error('Database engine not initialized');
        }
        return this.db;
    }
}

export default DatabaseService;
