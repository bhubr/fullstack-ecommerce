import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';

import type { ICategory, IProductWithCategory } from '../types';
import { readCategories, readProducts } from '../api';
import Home from './Home.component';

const HomeContainer = () => {
  const [products, setProducts] = useState<null | IProductWithCategory[]>(null);
  const [categories, setCategories] = useState<null | ICategory[]>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | AxiosError>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoryRecords = await readCategories();
        setCategories(categoryRecords);
        const { records: productRecords, count } = await readProducts();
        const productsWithCats = productRecords.map((product) => ({
          ...product,
          // Seems like a bold guess, but we're actually sure that the category exists,
          // since there are not many categories and we request them all at once
          category: categoryRecords.find((category) => category.id === product.categoryId) as ICategory,
        }));
        setProducts(productsWithCats);
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
      categories={categories}
      loading={loading}
      error={error}
      dropdownOpen={dropdownOpen}
      toggleDropdown={() => setDropdownOpen((prev) => !prev)}
    />
  );
};

export default HomeContainer;