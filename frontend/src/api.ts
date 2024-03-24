import axios from 'axios';
import { serverUrl } from './settings';
import { ICategory, IProduct } from './types';

const api = axios.create({
  baseURL: `${serverUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true,
});

// export const readUser = async () => {
//   const res = await api.get('/auth/me');
//   return res.data;
// };

// export const signin = async (email: string, password: string) => {
//   const res = await api.post(
//     '/auth/signin',
//     { email, password },
//   );
//   return res.data;
// };

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

export const readCategories = async (): Promise<ICategory[]> =>
  api.get('/categories').then((res) => res.data as ICategory[]);

export const readProducts = async (): Promise<IReadProductsRes> => {
  const res = await api.get('/products');
  // Get count from header
  const count = Number(res.headers['x-total-count']);
  return { records: res.data, count };
};

export const readOneProduct = async (id: number) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
