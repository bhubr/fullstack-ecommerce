import type { ICartItem, ICart, ICartWithItems, ICartProduct, IProduct } from '../app-types';
import DatabaseService from '../services/database-service';

export async function createCart(userId: number): Promise<ICartWithItems> {
  const db = (await DatabaseService.getInstance()).getDB();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const payload = { userId, createdAt, updatedAt };
  const cart = await db.insertIntoTable<ICart>('cart', payload);
  return { ...cart, items: [] };
}

export async function updateCart(
  cartId: number,
  items: { productId: number; quantity: number; }[]
): Promise<void> {
  const db = (await DatabaseService.getInstance()).getDB();
  const { records: existingItems } = await db.getAllFromTable<ICartProduct>(
    'cart_product',
    {
      where: [['cartId', '=', cartId]],
    }
  );
  let didUpdate = false;
  // add items that are not already in the cart
  console.log(">> incoming items", items)
  console.log(">> existing items", existingItems)
  for (const item of items) {
    const existingItem = existingItems.find(
      (i) => i.productId === item.productId
    );
    // if the item is not in the cart, add it
    if (existingItem === undefined) {
      await db.insertIntoTable<ICartItem>('cart_product', {
        cartId,
        productId: item.productId,
        quantity: item.quantity,
      });
      didUpdate = true;
    }
    // if the item is already in the cart, update the quantity
    else if (existingItem.quantity !== item.quantity) {
      await db.query(
        'UPDATE cart_product SET quantity = ? WHERE productId = ? AND cartId = ?',
        [item.quantity, item.productId, cartId]
      );
      didUpdate = true;
    }
  }
  // Now remove items that are not in the new list
  for (const existingItem of existingItems) {
    const item = items.find((i) => i.productId === existingItem.productId);
    // if the item is not in the new list, remove it
    if (item === undefined) {
      await db.query(
        'DELETE FROM cart_product WHERE productId = ? AND cartId = ?',
        [existingItem.productId, cartId]
      );
      didUpdate = true;
    }
  }

  if (didUpdate) {
    await db.updateTable('cart', 'id', cartId, {
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function getCartByUserId(userId: number): Promise<ICartWithItems> {
  const db = (await DatabaseService.getInstance()).getDB();

  // valid carts are those that have not been checked out
  // and are not older than one week
  const { records: carts } = await db.getAllFromTable<ICartWithItems>('cart', {
    where: [
      ['userId', '=', userId],
      ['checkedOutAt', 'IS NULL'],
      [
        'updatedAt',
        '>',
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      ],
    ],
  });
  let [cart] = carts;
  if (cart === undefined) {
    cart = await createCart(userId);
  }

  const { records: items } = await db.getAllFromTable<ICartProduct>(
    'cart_product',
    {
      where: [['cartId', '=', cart.id]],
    }
  );
  const whereInClause =
    items.length > 0
      ? `id IN (${items.map((it) => it.productId).join(',')})`
      : 'FALSE';
  const  products = (await db.query(`
    SELECT * FROM product
    WHERE ${whereInClause}
  `, [])) as IProduct[];
  const productsWithQuantity = products.map((product) => ({
    product,
    quantity: items.find((it) => it.productId === product.id)!.quantity,
  }))

  return { ...carts[0], items: productsWithQuantity };
}
