import express from 'express';
import checkJwt from '../middlewares/check-jwt';
import {
  AuthRequest,
  IOrder,
  IOrderProduct,
  ISubmitOrderDTO,
} from '../app-types';
import { getCartByUserId } from '../models/cart';
import createOrderReference from '../helpers/create-order-reference';
import DatabaseService from '../services/database-service';

const ordersRouter = express.Router();

const isExpiryDateValid = (expiry: string): [true] | [false, string] => {
  const [month, year] = expiry.split('/');
  if (!/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) {
    return [false, "Format de date d'expiration invalide"];
  }
  const currentYear = new Date().getFullYear() - 2000;
  const currentMonth = new Date().getMonth() + 1;
  console.log(currentYear, currentMonth);
  if (parseInt(year) < currentYear) {
    return [false, "Date d'expiration dépassée"];
  }
  if (parseInt(year) === currentYear && parseInt(month) < currentMonth) {
    return [false, "Date d'expiration dépassée"];
  }
  return [true];
};

ordersRouter.get('/', checkJwt, async (req: AuthRequest, res) => {
  const { userId } = req.auth;
  try {
    const db = (await DatabaseService.getInstance()).getDB();
    const orders = await db.query('SELECT * FROM `order` WHERE userId = ?', [
      userId,
    ]);
    return res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    const message = (err as Error).message;
    return res.status(400).json({ error: message });
  }
});

// Get one order by reference,
// Get the associated cart_product entries AND the associated product entries
ordersRouter.get('/:reference', checkJwt, async (req: AuthRequest, res) => {
  const { userId } = req.auth;
  const { reference } = req.params;
  try {
    const db = (await DatabaseService.getInstance()).getDB();
    const { records } = await db.getAllFromTable<IOrder>('order', {
      where: [
        ['userId', '=', userId],
        ['reference', '=', reference],
      ],
    });
    const [order] = records;
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const { records: orderItems } = await db.getAllFromTable<IOrderProduct>(
      'order_product',
      {
        where: [['orderId', '=', order.id]],
      }
    );
    const products = await Promise.all(
      orderItems.map(async (item) => {
        return db.query('SELECT * FROM product WHERE id = ?', [item.productId]);
      })
    );
    const itemsWithProduct = orderItems.map((item, index) => ({
      ...item,
      product: products[index][0],
    }));
    return res.status(200).json({ ...order, items: itemsWithProduct });
  } catch (err) {
    console.error(err);
    const message = (err as Error).message;
    return res.status(400).json({ error: message });
  }
});

ordersRouter.post('/', checkJwt, async (req: AuthRequest, res) => {
  const { address, payment } = req.body as ISubmitOrderDTO;
  const { userId } = req.auth;

  const { addrStreet, addrCity, addrPostCode, addrPhone } = address;
  if (!addrStreet || !addrCity || !addrPostCode || !addrPhone) {
    return res.status(400).json({ error: "L'adresse complète est requise" });
  }
  const { cardNumber, cardExpiry, cardCvc } = payment;
  const sanitizedCardNumber = cardNumber.replace(/\s/g, '');
  // valid number is 16 digits
  if (!/^\d{16}$/.test(sanitizedCardNumber)) {
    return res
      .status(400)
      .json({ error: 'Format de numéro de carte incorrect' });
  }
  // only valid number is 1234123412341234
  if (sanitizedCardNumber !== '1234123412341234') {
    return res.status(400).json({ error: 'Numéro de carte invalide' });
  }
  // only valid CVS is 123
  if (cardCvc !== '123') {
    return res.status(400).json({ error: 'Cryptogramme de sécurité invalide' });
  }
  const [expiryValid, expiryError] = isExpiryDateValid(cardExpiry);
  if (!expiryValid) {
    return res.status(400).json({ error: expiryError });
  }
  // valid expiry is MM/YY (should be in the future)
  const reference = await createOrderReference();
  const status = 'paid'; // can be 'paid', 'shipped', 'delivered'
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  try {
    const { id: cartId, items } = await getCartByUserId(userId);
    // Fail if cart is empty
    if (items.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide' });
    }

    // compute total price
    const subTotal = items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );
    const shippingCost = subTotal > 50 ? 0 : 10;

    // create order
    const db = (await DatabaseService.getInstance()).getDB();
    const order = await db.insertIntoTable('order', {
      userId,
      addrStreet,
      addrCity,
      addrPostCode,
      addrPhone,
      reference,
      subTotal,
      shippingCost,
      status,
      createdAt,
      updatedAt,
    });

    // create order_product items payloads
    const orderItems = items.map((item) => ({
      orderId: order.id,
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));
    // insert order_product items
    for (const item of orderItems) {
      await db.insertIntoTable('order_product', item);
    }

    // clear cart
    await db.updateTable('cart', 'id', cartId, {
      checkedOutAt: new Date().toISOString(),
    });

    return res.status(200).json(order);
  } catch (err) {
    console.error(err);
    const message = (err as Error).message;
    return res.status(400).json({ error: message });
  }
});

export default ordersRouter;
