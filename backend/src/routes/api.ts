import express from 'express';
import authRouter from './auth';
import productsRouter from './products';
import categoriesRouter from './categories';
import cartRouter from './cart';
import ordersRouter from './orders';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/cart', cartRouter);
apiRouter.use('/orders', ordersRouter);

export default apiRouter;