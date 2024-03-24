import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// my problem now is:
// how do i call loadDatabaseEngine from here?
// if I do that I cannot really "export default app" anymore,
// because I need to call loadDatabaseEngine first
// but then it makes importing "app" from test files (in order to do integ test with supertest) a bit more complicated
// how to solve this?
import apiRouter from './routes/api';
import DatabaseService from './services/database-service';
import { clientOrigin, isProduction, staticImagesParent } from './settings';

export default async function initializeApp(): Promise<Application> {
  const app = express();
  app.use(morgan('dev'));
  if (!isProduction) {
    app.use(
      cors({
        origin: clientOrigin,
        credentials: true,
      })
    );
  }
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    helmet({
      // allow images to be loaded from other domains
      crossOriginResourcePolicy: false,
    })
  );
  app.use(express.static(staticImagesParent));

  app.use('/api', apiRouter);

  // This will initialize the database engine
  await DatabaseService.getInstance();

  return app;
}
