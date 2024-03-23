export interface IProduct {
  name: string;
  price: string;
  oldPrice?: string;
  reviews?: number;
  pictureUrl: string;
  sale?: boolean;
}
