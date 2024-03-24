import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { readProducts } from '../api';
import { IProduct } from '../types';
import Home from './Home.component';

const HomeContainer = () => {
  const [products, setProducts] = useState<null | IProduct[]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | AxiosError>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { records, count } = await readProducts();
        setProducts(records);
        setLoading(false);
      } catch (err) {
        setError(err as AxiosError);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Home
      products={products}
      loading={loading}
      error={error}
    />
  );
};

export default HomeContainer;