import axios from 'axios';
import type { AxiosError } from 'axios';
import { serverUrl } from './settings';
import type { ICategory, IProduct, ISubmitOrderDTO, IOrder } from './types';

const api = axios.create({
  baseURL: `${serverUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
});

export const readUser = async () => {
  const res = await api.get('/auth/me', { withCredentials: true });
  return res.data;
};

export const signin = async (email: string, password: string) => {
  const res = await api.post(
    '/auth/signin',
    { email, password },
    { withCredentials: true }
  );
  return res.data;
};

export const signout = async () => {
  const res = await api.post('/auth/signout', {}, { withCredentials: true });
  return res.data;
};

// export const signup = async (email: string, password: string) => {
//   const res = await api.post(
//     '/auth/signup',
//     { email, password },
//   );
//   return res.data;
// };

interface IReadProductsRes {
  records: IProduct[];
  count: number;
}

interface IReadProductsParams {
  categorySlug?: string;
  page: number;
}

export const readCategories = async (): Promise<ICategory[]> =>
  api.get('/categories').then((res) => res.data as ICategory[]);

export const readProducts = async ({
  page = 1,
  categorySlug,
}: IReadProductsParams): Promise<IReadProductsRes> => {
  let url = `/products?page=${page}`;
  if (categorySlug !== undefined) {
    url += `&categorySlug=${categorySlug}`;
  }
  const res = await api.get(url);
  // Get count from header
  const count = Number(res.headers['x-total-count']);
  return { records: res.data, count };
};

export const readOneProduct = async (id: number) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const updateCart = async (
  items: { productId: number; quantity: number }[]
) => {
  const res = await api.put(
    '/cart',
    { items },
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const submitOrder = async (payload: ISubmitOrderDTO) => {
  const res = await api.post('/orders', payload, { withCredentials: true });
  return res.data;
};

export const readOrders = async () => {
  try {
    const response = await api.get('/orders', { withCredentials: true });
    return response.data; // Assuming the response contains orders data
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error; // Propagate the error
  }
};

export const readOrderByReference = async (reference: string): Promise<IOrder> => {
  try {
    const response = await api.get<IOrder>(`/orders/${reference}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error as AxiosError<{ error: string }>; // Propagate the error
  }
};