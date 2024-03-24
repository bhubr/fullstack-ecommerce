import { useEffect, useMemo, useState } from 'react';
import { AxiosError } from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';

import type { ICategory, IProductWithCategory, SortOrder } from '../types';
import { readCategories, readProducts } from '../api';
import Home from './Home.component';

const HomeContainer = () => {
  const [products, setProducts] = useState<null | IProductWithCategory[]>(null);
  const [categories, setCategories] = useState<null | ICategory[]>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('price-asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | AxiosError>(null);
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const sortedProducts = useMemo(() => {
    if (products === null) {
      return null;
    }
    return [...products].sort((a, b) => {
      if (sortOrder === 'price-asc') {
        return a.price - b.price;
      }
      if (sortOrder === 'price-desc') {
        return b.price - a.price;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, sortOrder]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoryRecords = await readCategories();
        setCategories(categoryRecords);
        const { records: productRecords, count } = await readProducts({
          categorySlug,
          page,
        });
        const productsWithCats = productRecords.map((product) => ({
          ...product,
          // Seems like a bold guess, but we're actually sure that the category exists,
          // since there are not many categories and we request them all at once
          category: categoryRecords.find(
            (category) => category.id === product.categoryId
          ) as ICategory,
        }));
        setProducts(productsWithCats);
        setLoading(false);
      } catch (err) {
        setError(err as AxiosError);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, categorySlug]);

  return (
    <Home
      products={sortedProducts}
      categories={categories}
      loading={loading}
      error={error}
      dropdownOpen={dropdownOpen}
      toggleDropdown={() => setDropdownOpen((prev) => !prev)}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
    />
  );
};

export default HomeContainer;
