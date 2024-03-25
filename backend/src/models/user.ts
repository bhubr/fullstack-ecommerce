import argon2 from 'argon2';
import type { Scalar } from '../db/types';
import type { IUser, IUserDTO, IUserWithHash } from '../app-types';
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
    throw new Error('Un utilisateur avec cet e-mail existe déjà');
  }
  return db.insertIntoTable<IUserDTO>('user', payload);
}

export async function createUser(
  fullName: string,
  email: string,
  password: string
): Promise<IUser> {
  const passwordHash = await argon2.hash(password);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const payload = { fullName, email, passwordHash, createdAt, updatedAt };
  const user = await insertUser(payload);
  return user;
}
