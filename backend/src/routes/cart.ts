import express from 'express';
import checkJwt from '../middlewares/check-jwt';
import { AuthRequest } from '../app-types';
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

export default cartRouter;