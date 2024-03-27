import express from 'express';
import DatabaseService from '../services/database-service';
import { getProducts } from '../models/product';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const categorySlug = req.query.categorySlug as string | undefined;
  const { products, count } = await getProducts({ page, categorySlug });
  res.set('X-Total-Count', String(count)).json(products);
});

productsRouter.post('/', async (req, res) => {
  const { name, slug, price, description = '', pictureUrl = '' } = req.body;
  try {
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const db = (await DatabaseService.getInstance()).getDB();
    const product = await db.insertIntoTable('product', {
      name,
      slug,
      price,
      description,
      pictureUrl,
      createdAt,
      updatedAt,
    });
    res.status(201).send(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default productsRouter;
