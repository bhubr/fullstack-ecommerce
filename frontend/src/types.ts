export interface IProduct {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  pictureUrl: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface IPartialProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export interface IPartialCartItem {
  product: IPartialProduct;
  quantity: number;
}

export interface IProductWithCategory extends IProduct {
  category: ICategory;
}

export interface ICategory {
  id: number;
  name: string;
  slug: string;
}

export interface IUser {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICart {
  id: number;
  userId: number;
  checkedOutAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: ICartItem[];
}

export interface IPartialCart {
  id: number;
  userId: number;
  checkedOutAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: IPartialCartItem[];
}

export interface IUserWithCart extends IUser {
  cart: ICart;
}

export type SortOrder = 'price-asc' | 'price-desc' | 'date-desc';

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
  items: { product: IProduct; price: number; quantity: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface IStockInformation {
  productId: number;
  currentStock: number;
  requestedQuantity: number;
}
