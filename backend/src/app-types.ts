export interface IUserDTO {
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type IUserWithHash = IUser & { passwordHash: string };

export interface ICart {
  id: number;
  userId: number;
  checkedOutAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  cartId: number;
  productId: number;
  quantity: number;
}

export interface ICartWithItems extends ICart {
  items: ICartItem[];
}
