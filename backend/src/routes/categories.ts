import express from 'express';
import DatabaseService from '../services/database-service';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req, res) => {
  const db = (await DatabaseService.getInstance()).getDB();
  const { records: categories } = await db.getAllFromTable('category');
  res.json(categories);
});

categoriesRouter.post('/', async (req, res) => {
  const { name, slug } = req.body;
  try {
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const db = (await DatabaseService.getInstance()).getDB();
    const category = await db.insertIntoTable('category', {
      name,
      slug,
      createdAt,
      updatedAt,
    });
    res.status(201).send(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default categoriesRouter;
