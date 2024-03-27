import axios from 'axios';
import type { AxiosError } from 'axios';
import { serverUrl } from './settings';
import type {
  ICategory,
  IProduct,
  ISubmitOrderDTO,
  IOrder,
  IStockInformation,
  IUserWithCart,
} from './types';

const baseURL = `${serverUrl}/api`;
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const readUser = async (): Promise<IUserWithCart> => {
  const res = await api.get<IUserWithCart>('/auth/me', {
    withCredentials: true,
  });
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

export const signup = async (
  fullName: string,
  email: string,
  password: string
) => {
  const res = await api.post(
    '/auth/signup',
    { fullName, email, password },
    { withCredentials: true }
  );
  return res.data;
};

interface IReadProductsRes {
  records: IProduct[];
  count: number;
}

interface IReadProductsParams {
  categorySlug?: string;
  page: number;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
}

export const readCategories = async (): Promise<ICategory[]> =>
  api.get('/categories').then((res) => res.data as ICategory[]);

export const readProducts = async ({
  page = 1,
  categorySlug,
  orderBy,
  orderDirection,
}: IReadProductsParams): Promise<IReadProductsRes> => {
  const url = new URL('/api/products', serverUrl);
  url.searchParams.append('page', String(page));
  url.searchParams.append('orderBy', orderBy);
  url.searchParams.append('orderDirection', orderDirection);
  if (categorySlug !== undefined) {
    url.searchParams.append('categorySlug', categorySlug);
  }
  const res = await api.get(url.toString());
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

export const readOrderByReference = async (
  reference: string
): Promise<IOrder> => {
  try {
    const response = await api.get<IOrder>(`/orders/${reference}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error as AxiosError<{ error: string }>; // Propagate the error
  }
};

export const checkCartAvailability = async (): Promise<IStockInformation[]> => {
  try {
    const response = await api.get<IStockInformation[]>('/cart/availability', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error checking cart availability:', error);
    throw error; // Propagate the error
  }
};
