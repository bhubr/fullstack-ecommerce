import { Request } from 'express';

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

export interface IProduct {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  pictureUrl: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICartProduct {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICartWithItems extends ICart {
  items: ICartItem[];
}

export interface AuthRequest extends Request {
  auth?: {
    userId: number;
  };
}

export interface IAddressInformation {
  addrStreet: string;
  addrCity: string;
  addrPostCode: string;
  addrPhone: string;
}

export interface IPaymentInformation {
  cardHolder: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

export interface ISubmitOrderDTO {
  address: IAddressInformation;
  payment: IPaymentInformation;
}

export interface IOrder {
  id: number;
  userId: number;
  addrStreet: string;
  addrCity: string;
  addrPostCode: string;
  addrPhone: string;
  reference: string;
  subTotal: number;
  shippingCost: number;
}

export interface IOrderProduct {
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}