import request from 'supertest';
import initializeApp from '../../src/initialize-app';
import { describe } from 'node:test';
import type { Application } from 'express';
import DatabaseService from '../../src/services/database-service';
import { seedCategoriesAndProducts } from '../helpers/seed-db';

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
    await seedCategoriesAndProducts();
  });

  describe('GET /api/products', () => {
    it('should return a list of products', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            slug: expect.any(String),
            price: expect.any(Number),
            stock: expect.any(Number),
          }),
        ])
      );
    });
  });
});
