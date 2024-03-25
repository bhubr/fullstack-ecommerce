import { IProduct } from '../src/app-types';
import DatabaseService from '../src/services/database-service';

async function main() {
  const db = (await DatabaseService.getInstance()).getDB();
  // Randomize stock for each product
  const products = (await db.query('SELECT * FROM product')) as IProduct[];

  for (const product of products) {
    const stock = Math.floor(Math.random() * 20);
    await db.query('UPDATE product SET stock = ? WHERE id = ?', [
      stock,
      product.id,
    ]);
  }
}

main();
