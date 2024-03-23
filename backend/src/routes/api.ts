import express from 'express';
import productsRouter from './products';

const apiRouter = express.Router();

apiRouter.use('/products', productsRouter);

export default apiRouter;