import express from 'express';
import DatabaseService from '../services/database-service';
import { IGetAllFromTableOptions } from '../db/types';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  const { page: pageStr = '1', categoryId } = req.query;
  const page = Number(pageStr);
  const npp = 12;
  const offset = (page - 1) * npp;
  const db = (await DatabaseService.getInstance()).getDB();
  const options: IGetAllFromTableOptions = {
    offset,
    limit: npp,
  };
  if (categoryId !== undefined) {
    options.where = [['categoryId', '=', Number(categoryId as string)]];
  }
  const { records: products, count } = await db.getAllFromTable('product');
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
