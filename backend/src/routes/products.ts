import express from 'express';
import DatabaseService from '../services/database-service';
import { IGetAllFromTableOptions } from '../db/types';

const productsRouter = express.Router();

async function getProducts({
  page,
  categorySlug,
}: {
  page: number;
  categorySlug?: string;
}) {
  const npp = 12;
  const offset = (page - 1) * npp;
  const db = (await DatabaseService.getInstance()).getDB();
  const options: IGetAllFromTableOptions = {
    offset,
    limit: npp,
  };
  if (categorySlug !== undefined) {
    const category = await db.getOneFromTableByField<{ id: number }>(
      'category',
      'slug',
      categorySlug
    );
    options.where = [['categoryId', '=', category.id]];
  }
  const { records: products, count } = await db.getAllFromTable(
    'product',
    options
  );
  return { products, count };
}

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
