import { describe, it, expect } from 'vitest';
import type { IPartialCart, IPartialCartItem, IProduct } from '../types';
import mergeCarts from './merge-carts';


describe('Helpers: merge-carts', () => {
  // Should merge carts:
  // One is incoming from the server, the other is stored in the local storage
  // That from the server has interface ICart, that from the local storage has interface ICartItem[]
  // The result should be synced back to the server after merging
  it('should merge carts', () => {
    // Arrange
    const localCart: IPartialCartItem[] = [
      {
        // add all the absolutely necessary fields (price, stock, etc.)
        product: { id: 1, name: 'Product 1', price: 100, stock: 10 },
        quantity: 2,
      },
      {
        product: { id: 2, name: 'Product 2', price: 200, stock: 20 },
        quantity: 3,
      },
    ];
    const remoteCart: IPartialCart = {
      id: 1,
      userId: 1,
      checkedOutAt: null,
      createdAt: '2021-01-01',
      updatedAt: '2021-01-01',
      items: [
        {
          product: { id: 2, name: 'Product 2', price: 200, stock: 20 },
          quantity: 1,
        },
        {
          product: { id: 3, name: 'Product 3', price: 300, stock: 30 },
          quantity: 1,
        },
      ],
    };
    const expectedCart = {
      id: 1,
      userId: 1,
      checkedOutAt: null,
      createdAt: '2021-01-01',
      updatedAt: '2021-01-01',
      items: [
        {
          product: { id: 2, name: 'Product 2', price: 200, stock: 20 },
          quantity: 4,
        },
        {
          product: { id: 3, name: 'Product 3', price: 300, stock: 30 },
          quantity: 1,
        },
        {
          product: { id: 1, name: 'Product 1', price: 100, stock: 10 },
          quantity: 2,
        },
      ],
    };
    const actualCart = mergeCarts(localCart, remoteCart);
    const { items: actualItems, ...actualRest } = actualCart;
    const { items: expectedItems, ...expectedRest } = expectedCart;
    // expect(actualCart).toEqual(expectedCart);
    expect(actualRest).toEqual(expectedRest);
    // Use arrayContaining or arrayContainingInAnyOrder to compare arrays
    expect(actualItems).toEqual(expect.arrayContaining(expectedItems));
  });
});
