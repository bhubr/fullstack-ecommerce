import { ReactNode, useState } from 'react';

import type { ICartItem, IProduct } from '../types';
import CartContext from '../contexts/CartContext';

const CartProvider = ({ children }: { children: ReactNode }) => {
  // items
  const [cart, setCart] = useState<ICartItem[]>([]);

  // add an item
  const addItem = (product: IProduct) =>
    setCart((prev: ICartItem[]) => {
      const existing = prev.find(
        (it: ICartItem) => it.product.id === product.id
      );
      return existing
        ? prev.map((it: ICartItem) =>
            it.product.id === product.id
              ? {
                  ...it,
                  quantity: it.quantity + 1,
                }
              : it
          )
        : [...prev, { product, quantity: 1 }];
    });

  // remove an item
  const removeItem = (product: IProduct) =>
    setCart((prev: ICartItem[]) =>
      prev.filter((it) => it.product.id !== product.id)
    );

  // change an item quantity
  const setItemQuantity = (product: IProduct, quantity: number) =>
    setCart((prev: ICartItem[]) => {
      const existing = prev.find(
        (it: ICartItem) => it.product.id === product.id
      );
      return existing
        ? prev.map((it: ICartItem) =>
            it.product.id === product.id
              ? {
                  ...it,
                  quantity,
                }
              : it
          )
        : [...prev, { product, quantity }];
    });

  return (
    <CartContext.Provider
      value={{
        items: cart,
        addItem,
        removeItem,
        setItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
