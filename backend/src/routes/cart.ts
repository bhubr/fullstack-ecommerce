import express from 'express';
import checkJwt from '../middlewares/check-jwt';
import { AuthRequest, IStockInformation } from '../app-types';
import { getCartByUserId, updateCart } from '../models/cart';

const cartRouter = express.Router();

cartRouter.put('/', checkJwt, async (req: AuthRequest, res) => {
  const { items } = req.body;
  const { userId } = req.auth;

  try {
    const cart = await getCartByUserId(userId);
    await updateCart(cart.id, items);
    return res.status(200).json({ message: 'Cart updated' });
  } catch (err) {
    console.error(err);
    const message = (err as Error).message;
    return res.status(400).json({ error: message });
  }
});

// Check availability for cart items
// This route is used to check the availability of products in the cart
// before the user goes to the checkout page
cartRouter.get('/availability', checkJwt, async (req: AuthRequest, res) => {
  const { userId } = req.auth;

  try {
    const cart = await getCartByUserId(userId);
    const stockInformation: IStockInformation[] = [];
    for (const item of cart.items) {
      const currentStock = item.product.stock;
      const requestedQuantity = item.quantity;
      stockInformation.push({
        productId: item.product.id,
        currentStock,
        requestedQuantity,
      });
    }
    res.send(stockInformation);
  } catch (err) {
    console.error(err);
    const message = (err as Error).message;
    return res.status(400).json({ error: message });
  }
});

export default cartRouter;
