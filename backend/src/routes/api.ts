import express from 'express';
import productsRouter from './products';
import categoriesRouter from './categories';

const apiRouter = express.Router();

apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/products', productsRouter);

export default apiRouter;