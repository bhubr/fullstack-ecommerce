import { ReactNode, useContext, useEffect, useState } from 'react';

import type { ICartItem, IProduct } from '../types';
import CartContext from '../contexts/CartContext';
import AuthContext from '../contexts/AuthContext';
import { readUser, updateCart } from '../api';
import mergeCarts from '../helpers/merge-carts';

const hasStoredCart = () => localStorage.getItem('cart') !== null;

const getStoredCart = (): ICartItem[] => {
  const storedCart = localStorage.getItem('cart');
  return storedCart ? JSON.parse(storedCart) : [];
};

const storeCart = (cart: ICartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const CartProvider = ({ children }: { children: ReactNode }) => {
  const { prevUser, user } = useContext(AuthContext);
  const [cart, setCart] = useState<ICartItem[]>([]); // init will be done in useEffect

  useEffect(() => {
    // User just authenticated. This is the only moment when we should merge carts
    if (prevUser === null && user !== null && hasStoredCart()) {
      const mergedCart = mergeCarts(getStoredCart(), user.cart);
      const updatePayload = mergedCart.items.map((it) => ({
        productId: it.product.id,
        quantity: it.quantity,
      }));
      updateCart(updatePayload);
      localStorage.removeItem('cart');
      setCart(mergedCart.items);
    }
    // User just signed out. Clear the cart
    if (prevUser !== null && user === null) {
      setCart([]);
    }
  }, [prevUser, user]);

  useEffect(() => {
    // Only on 1st mount: initialize the cart based on
    // - the user's cart if authenticated
    // - the local storage if not authenticated
    const initializeCart = async () => {
      if (user) {
        setCart(user.cart.items);
      } else {
        setCart(getStoredCart());
      }
    };
    initializeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateLocalAndRemoteCart(updatedCart: ICartItem[]) {
    const updateCartPayload = updatedCart.map((it) => ({
      productId: it.product.id,
      quantity: it.quantity,
    }));
    if (user) {
      await updateCart(updateCartPayload);
    } else {
      storeCart(updatedCart);
    }
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
