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
  // oldPrice?: string;
  // reviews?: number;
  // sale?: boolean;
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

export type SortOrder = 'price-asc' | 'price-desc' | 'date-desc';

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface IUserWithCart extends IUser {
  cart: {
    items: ICartItem[];
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
  items: { product: IProduct; price: number; quantity: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface IStockInformation {
  productId: number;
  currentStock: number;
  requestedQuantity: number;
}
