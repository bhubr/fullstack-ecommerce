import { getProducts } from '../../src/models/product';
import { seedCategoriesAndProducts } from '../helpers/seed-db';

const arrayOfProducts = expect.objectContaining({
  products: expect.arrayContaining([
    expect.objectContaining({
      name: expect.any(String),
      slug: expect.any(String),
      price: expect.any(Number),
      stock: expect.any(Number),
    }),
  ]),
  count: expect.any(Number),
})

describe('Product model', () => {
  describe('getProducts', () => {
    beforeAll(async () => {
      await seedCategoriesAndProducts();
    });

    it('products of cat "smartphones" in "price-asc" order', async () => {
      // expect something
      const productsWithCount = await getProducts({
        page: 1,
        categorySlug: 'smartphones',
      });
      expect(productsWithCount).toEqual(
        arrayOfProducts
      );
      const { products } = productsWithCount;
      expect(products.length).toEqual(10);
      const productsPrices = products.map((product) => product.price);
      console.log(productsPrices);
      expect(productsPrices).toEqual([
        126, 131.42, 138.14, 141.99, 181.7, 197.99, 284.2, 305.53, 324.55, 859,
      ]);
    });

    it('products of cat "smartphones" in "price-desc" order', async () => {
      // expect something
      const productsWithCount = await getProducts({
        page: 1,
        categorySlug: 'smartphones',
        orderDirection: 'desc',
      });
      expect(productsWithCount).toEqual(
        arrayOfProducts
      );
      const { products } = productsWithCount;
      expect(products.length).toEqual(10);
      const productsPrices = products.map((product) => product.price);
      console.log(productsPrices);
      expect(productsPrices).toEqual([
        859, 324.55, 305.53, 284.2, 197.99, 181.7, 141.99, 138.14, 131.42, 126,
      ]);
    });
  });
});
