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