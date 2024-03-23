import express from 'express';
import DatabaseService from '../services/database-service';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  const db = (await DatabaseService.getInstance()).getDB();
  const products = await db.getAllFromTable('product');
  res.json(products);
});

productsRouter.post('/', async (req, res) => {
  const { name, slug, price, description = '' } = req.body;
  try {
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const db = (await DatabaseService.getInstance()).getDB();
    const product = await db.insertIntoTable('product', {
      name,
      slug,
      price,
      description,
      createdAt,
      updatedAt,
    });
    res.status(201).send(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default productsRouter;
