import { createContext } from 'react';
import { ICartItem, IProduct } from '../types';

export interface ICartContext {
  items: ICartItem[];
  addItem(product: IProduct): Promise<void>;
  removeItem(product: IProduct): Promise<void>;
  setItemQuantity(product: IProduct, quantity: number): Promise<void>;
  clearLocal(): Promise<void>;
}

const CartContext = createContext<ICartContext>({
  items: [],
  addItem: async () => {},
  removeItem: async () => {},
  setItemQuantity: async () => {},
  async clearLocal() {},
});

export default CartContext;
