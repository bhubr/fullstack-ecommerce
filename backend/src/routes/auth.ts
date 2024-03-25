import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

import isEmpty from '../helpers/is-empty';
import { jwtSecret } from '../settings';
import checkJwt from '../middlewares/check-jwt';
import { getUserByEmail, getUserById, insertUser } from '../models/user';
import { getCartByUserId } from '../models/cart';
import type { AuthRequest } from '../app-types';

const authRouter = express.Router();

const createJwt = (userId: number): string =>
  jwt.sign({ userId }, jwtSecret, {
    expiresIn: '1d',
  });

authRouter.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (isEmpty(fullName)) {
    return res.status(400).json({ message: 'Le nom est requis' });
  }
  if (isEmpty(email) || isEmpty(password)) {
    return res
      .status(400)
      .json({ message: "L'e-mail et le mot de passe sont requis" });
  }
  try {
    const passwordHash = await argon2.hash(password as string);
    const createdAt = new Date().toISOString();
    const payload = {
      fullName,
      email,
      passwordHash,
      createdAt,
      updatedAt: createdAt,
    };
    const user = await insertUser(payload);
    const jwt = createJwt(user.id);
    const jwtExpiresAt = Date.now() + 3600000;
    res.cookie('jwt', jwt, { httpOnly: true });
    return res.status(201).json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      jwt,
      jwtExpiresAt,
    });
  } catch (err) {
    const message = (err as Error).message;
    return res.status(400).json({ error: message });
  }
});

authRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body, isEmpty(email), isEmpty(password));
  if (isEmpty(email) || isEmpty(password)) {
    return res
      .status(400)
      .json({ error: "L'e-mail et le mot de passe sont requis" });
  }
  try {
    const user = await getUserByEmail(email);
    if (user === undefined) {
      return res
        .status(404)
        .json({ error: 'Aucun utilisateur correspondant à cet e-mail' });
    }
    const validPassword = await argon2.verify(
      user.passwordHash,
      password as string
    );
    if (!validPassword) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }
    const jwtExpiresAt = Date.now() + 3600000;
    const jwt = createJwt(user.id);
    res.cookie('jwt', jwt, { httpOnly: true });
    return res.status(200).json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      jwt,
      jwtExpiresAt,
    });
  } catch (err) {
    const message = (err as Error).message;
    return res.status(400).json({ error: message });
  }
});

authRouter.post('/signout', async (req, res) => {
  res.clearCookie('jwt');
  return res.status(200).json({ message: 'Vous êtes déconnecté' });
});

authRouter.get('/me', checkJwt, async (req: AuthRequest, res) => {
  if (req.auth === undefined) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const { userId } = req.auth;
    const user = await getUserById(userId);
    const cart = await getCartByUserId(userId);
    console.log('>> user/cart', user, cart);
    return res.status(200).json({ ...user, cart });
  } catch (err) {
    const message = (err as Error).message;
    return res.status(500).json({ error: message });
  }
});

export default authRouter;
