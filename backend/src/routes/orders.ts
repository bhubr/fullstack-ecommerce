import express from 'express';
import checkJwt from '../middlewares/check-jwt';
import { AuthRequest, ISubmitOrderDTO } from '../app-types';
import { getCartByUserId } from '../models/cart';
import createOrderReference from '../helpers/create-order-reference';
import DatabaseService from '../services/database-service';

const ordersRouter = express.Router();

ordersRouter.post('/', checkJwt, async (req: AuthRequest, res) => {
  const { address, payment } = req.body as ISubmitOrderDTO;
  const { userId } = req.auth;
  // build payload, below are fields
  /*
  userId
  addrStreet
  addrCity
  addrPostCode
  addrPhone
  reference
  status
  createdAt
  updatedAt
  */
  const { addrStreet, addrCity, addrPostCode, addrPhone } = address;
  console.log('>> address:', addrStreet, addrCity, addrPostCode, addrPhone);
  const reference = await createOrderReference();
  const status = 'paid'; // can be 'paid', 'shipped', 'delivered'
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  console.log('>> payment:', payment);
  console.log('>> other info:', reference, status, createdAt, updatedAt);

  try {
    // create order
    const db = (await DatabaseService.getInstance()).getDB();
    // await db.query(
    //   `INSERT INTO \`order\` (userId, addrStreet, addrCity, addrPostCode, addrPhone, reference, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //   [
    //     userId,
    //     addrStreet,
    //     addrCity,
    //     addrPostCode,
    //     addrPhone,
    //     reference,
    //     status,
    //     createdAt,
    //     updatedAt,
    //   ]
    // );
    const order = await db.insertIntoTable('order', {
      userId,
      addrStreet,
      addrCity,
      addrPostCode,
      addrPhone,
      reference,
      status,
      createdAt,
      updatedAt,
    });

    // create order items
    const { id: cartId, items } = await getCartByUserId(userId);
    // turn cart items to { orderId, productId, quantity, price }
    // console.log('>>> Order items:', items);
    const orderItems = items.map((item) => ({
      orderId: order.id,
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));
    for (const item of orderItems) {
      // await db.query(
      //   `INSERT INTO order_item (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)`,
      //   [item.orderId, item.productId, item.quantity, item.price]
      // );
      await db.insertIntoTable('order_product', item);
    }

    // clear cart
    await db.updateTable(
      'cart',
      'id',
      cartId,
      { checkedOutAt: new Date().toISOString() },
    );

    return res.status(200).json({ message: 'Order submitted' });
  } catch (err) {
    console.error(err);
    const message = (err as Error).message;
    return res.status(400).json({ error: message });
  }
});

export default ordersRouter;
