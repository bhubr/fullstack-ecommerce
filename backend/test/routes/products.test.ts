import request from 'supertest';
import initializeApp from '../../src/initialize-app';
import { describe } from 'node:test';
import type { Application } from 'express';
import DatabaseService from '../../src/services/database-service';

const makeProductPayload = (i: number) => ({
  name: `Sample Product ${i}`,
  slug: `sample-product-${i}`,
  price: 99.99 + i * 10,
  description: `This is a sample product #${i}`,
  pictureUrl: `https://via.placeholder.com/150?text=Product+${i}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

describe('Products routes', () => {
  let app: Application;

  beforeAll(async () => {
    app = await initializeApp();
  });

  beforeEach(async () => {
    const db = (await DatabaseService.getInstance()).getDB();
    await db.query('DELETE FROM product', []);
  });

  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      const db = (await DatabaseService.getInstance()).getDB();
      const productPayloads = [1, 2].map(makeProductPayload);
      const cat = await db.insertIntoTable('category', {
        name: 'Sample Category',
        slug: 'sample-category',
      });
      for (const payload of productPayloads) {
        await db.insertIntoTable('product', { ...payload, categoryId: cat.id });
      }
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        expect.objectContaining({
          name: 'Sample Product 1',
          slug: 'sample-product-1',
          price: 109.99,
        }),
        expect.objectContaining({
          name: 'Sample Product 2',
          slug: 'sample-product-2',
          price: 119.99,
        }),
      ]);
    });
  });
});
