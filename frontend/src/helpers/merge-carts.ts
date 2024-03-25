import type { ICart, ICartItem, IPartialCart, IPartialCartItem } from '../types';

export default function mergeCarts(
  localCart: ICartItem[],
  remoteCart: ICart
): ICart {
  const mergedItems: ICartItem[] = [];

  // Add all items from the local cart
  localCart.forEach((localItem) => {
    const existing = mergedItems.find(
      (it) => it.product.id === localItem.product.id
    );
    if (existing) {
      existing.quantity += localItem.quantity;
    } else {
      mergedItems.push(localItem);
    }
  });

  // Add all items from the remote cart
  remoteCart.items.forEach((remoteItem: ICartItem) => {
    const existing = mergedItems.find(
      (it) => it.product.id === remoteItem.product.id
    );
    if (existing) {
      existing.quantity += remoteItem.quantity;
    } else {
      mergedItems.push(remoteItem);
    }
  });

  return {
    ...remoteCart,
    items: mergedItems,
  };
}
