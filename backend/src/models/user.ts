import argon2 from 'argon2';
import type { Scalar } from '../db/types';
import {
  ICartItem,
  type ICart,
  type ICartWithItems,
  type IUser,
  type IUserDTO,
  type IUserWithHash,
} from '../app-types';
import DatabaseService from '../services/database-service';

export async function getUserByEmail(
  email: string
): Promise<IUserWithHash | undefined> {
  const db = (await DatabaseService.getInstance()).getDB();
  const user = await db.getOneFromTableByField<IUserWithHash>(
    'user',
    'email',
    email
  );
  return user;
}

export async function getUserById(id: number): Promise<IUser | undefined> {
  const db = (await DatabaseService.getInstance()).getDB();
  const user = await db.getOneFromTableByField<IUserWithHash>('user', 'id', id);
  delete user.passwordHash;
  return user;
}

export async function insertUser(
  payload: Record<string, Scalar>
): Promise<IUser> {
  const db = (await DatabaseService.getInstance()).getDB();
  const existingUser = await db.getOneFromTableByField<IUser>(
    'user',
    'email',
    payload.email
  );
  if (existingUser !== undefined) {
    throw new Error('User with this email already exists');
  }
  return db.insertIntoTable<IUserDTO>('user', payload);
}

export async function createUser(
  email: string,
  password: string
): Promise<IUser> {
  const passwordHash = await argon2.hash(password);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const payload = { email, passwordHash, createdAt, updatedAt };
  const user = await insertUser(payload);
  return user;
}

export async function createCart(userId: number): Promise<ICartWithItems> {
  const db = (await DatabaseService.getInstance()).getDB();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const payload = { userId, createdAt, updatedAt };
  const cart = await db.insertIntoTable<ICart>('cart', payload);
  return { ...cart, items: [] };
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
  const [cart] = carts;
  if (cart === undefined) {
    return createCart(userId);
  }

  const { records: items } = await db.getAllFromTable<ICartItem>('cart_item', {
    where: [['cartId', '=', cart.id]],
  });

  return { ...carts[0], items };
}
