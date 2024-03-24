import { createContext } from 'react';
import { IProduct } from '../types';

export interface ICartContext {
  items: ICartItem[];
  addItem(product: IProduct): void;
  removeItem(product: IProduct): void;
  setItemQuantity(product: IProduct, quantity: number): void;
}

const CartContext = createContext<ICartContext>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  setItemQuantity: () => {},
});

export default CartContext;
