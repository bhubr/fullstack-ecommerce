import { IProduct } from "../app-types";
import type { IGetAllFromTableOptions } from "../db/types";
import DatabaseService from "../services/database-service";

export async function getProducts({
  page,
  categorySlug,
  npp = 12,
  orderBy = 'price',
  orderDirection = 'asc',
}: {
  page: number;
  categorySlug?: string;
  npp?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}): Promise<{ products: IProduct[], count }> {
  const offset = (page - 1) * npp;
  const db = (await DatabaseService.getInstance()).getDB();
  const options: IGetAllFromTableOptions = {
    offset,
    order: {
      field: orderBy,
      direction: orderDirection.toUpperCase() as 'ASC' | 'DESC',
    },
    limit: npp,
  };
  if (categorySlug !== undefined) {
    const category = await db.getOneFromTableByField<{ id: number }>(
      'category',
      'slug',
      categorySlug
    );
    options.where = [['categoryId', '=', category.id]];
  }
  const { records: products, count } = await db.getAllFromTable<IProduct>(
    'product',
    options
  );
  return { products, count };
}