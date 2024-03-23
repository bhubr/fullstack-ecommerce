import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

// my problem now is:
// how do i call loadDatabaseEngine from here?
// if I do that I cannot really "export default app" anymore,
// because I need to call loadDatabaseEngine first
// but then it makes importing "app" from test files (in order to do integ test with supertest) a bit more complicated
// how to solve this?
import loadDatabaseEngine from './db/load-database-engine';
import { environment } from './settings';
import loadDatabaseConfig from './db/load-database-config';

export default async function initializeApp(): Promise<Application> {
  const app = express();
  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.json());
  app.use(helmet());

  const { dbConfig, connectionString } = await loadDatabaseConfig(environment);
  console.log('dbConfig', dbConfig);
  console.log('connectionString', connectionString);
  const db = await loadDatabaseEngine(dbConfig);
  await db.initialize(connectionString);

  app.get('/', async (req, res) => {
    const products = await db.query('SELECT * FROM product', []);
    res.json(products);
  });

  app.post('/products', async (req, res) => {
    const { name, slug, price, description = '' } = req.body;
    try {
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;
      await db.query(
        'INSERT INTO product (name, slug, price, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
        [name, slug, price, description, createdAt, updatedAt]
      );
      res.sendStatus(201);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return app;
}
