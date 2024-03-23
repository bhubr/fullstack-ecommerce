import axios from 'axios';
import { serverUrl } from './settings';

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

export const readProducts = async () => {
  const res = await api.get('/products');
  return res.data;
};

export const readOneProduct = async (id: number) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
