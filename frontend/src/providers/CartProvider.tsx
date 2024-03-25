import { ReactNode, useContext, useState } from 'react';

import type { ICartItem, IProduct } from '../types';
import CartContext from '../contexts/CartContext';
import AuthContext from '../contexts/AuthContext';
import { updateCart } from '../api';

const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState<ICartItem[]>(user?.cart.items ?? []);

  async function updateLocalAndRemoteCart(updatedCart: ICartItem[]) {
    const updateCartPayload = updatedCart.map((it) => ({
      productId: it.product.id,
      quantity: it.quantity,
    }));
    await updateCart(updateCartPayload);
    setCart(updatedCart);
  }

  // add an item
  const addItem = async (product: IProduct) => {
    const existing = cart.find((it: ICartItem) => it.product.id === product.id);
    const updatedCart = existing
      ? cart.map((it: ICartItem) =>
          it.product.id === product.id
            ? {
                ...it,
                quantity: it.quantity + 1,
              }
            : it
        )
      : [...cart, { product, quantity: 1 }];

    await updateLocalAndRemoteCart(updatedCart);
    setCart(updatedCart);
  };

  // remove an item
  const removeItem = async (product: IProduct) => {
    const updatedCart = cart.filter((it) => it.product.id !== product.id);
    await updateLocalAndRemoteCart(updatedCart);
  };

  // change an item quantity
  const setItemQuantity = async (product: IProduct, quantity: number) => {
    const existing = cart.find((it: ICartItem) => it.product.id === product.id);
    const updatedCart = existing
      ? cart.map((it: ICartItem) =>
          it.product.id === product.id
            ? {
                ...it,
                quantity,
              }
            : it
        )
      : [...cart, { product, quantity }];
    await updateLocalAndRemoteCart(updatedCart);
  };

  const clearLocal = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        items: cart,
        addItem,
        removeItem,
        setItemQuantity,
        clearLocal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
