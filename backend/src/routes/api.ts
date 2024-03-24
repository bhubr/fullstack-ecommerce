import express from 'express';
import authRouter from './auth';
import productsRouter from './products';
import categoriesRouter from './categories';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/products', productsRouter);

export default apiRouter;