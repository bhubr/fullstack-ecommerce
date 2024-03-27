// Purpose: Seed the database with some data for testing purposes.
// we'll use files from ../../fixtures
//  seed-categories.json for categories
//  seed-products.json for products
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import DatabaseService from '../../src/services/database-service';

async function readJSON(filePath: string) {
  const data = await readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function seedCategories() {
  const categories = await readJSON(resolve(__dirname, '../../fixtures/seed-categories.json'));
  const db = (await DatabaseService.getInstance()).getDB();
  for (const category of categories) {
    await db.insertIntoTable('category', category);
  }
}

export async function seedProducts() {
  const products = await readJSON(resolve(__dirname, '../../fixtures/seed-products.json'));
  const db = (await DatabaseService.getInstance()).getDB();
  for (const product of products) {
    await db.insertIntoTable('product', product);
  }
}

export async function seedCategoriesAndProducts() {
  await seedCategories();
  await seedProducts();
}