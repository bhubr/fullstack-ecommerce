import { ReactNode } from 'react';
import { Alert, Col, Row } from 'reactstrap';
import { AxiosError } from 'axios';

import type { ICategory, IProduct } from '../types';
import ProductCardList from '../components/ProductCardList';
import CategorySidebar from '../components/CategorySidebar';
import SortDropdown from '../components/SortDropdown';

interface IHomeProps {
  products: null | IProduct[];
  categories: null | ICategory[];
  loading: boolean;
  error: null | AxiosError;
  dropdownOpen: boolean;
  toggleDropdown: () => void;
}

const Home = ({ products, categories, loading, error, dropdownOpen, toggleDropdown }: IHomeProps) => {
  let element: undefined | ReactNode;
  if (loading) {
    element = <div>Loading...</div>;
  }
  if (error !== null) {
    element = (
      <Alert color="danger" dismissible>
        {error.message}
      </Alert>
    );
  }
  if (products !== null && categories !== null) {
    element = (
      <Row>
        <Col md="3">
          <CategorySidebar categories={categories} />
        </Col>
        <Col md="9">
          <div className="d-flex justify-content-end">
            <SortDropdown toggle={toggleDropdown} isOpen={dropdownOpen} />
          </div>
          <ProductCardList products={products} />
        </Col>
      </Row>
    );
  }

  return <section className="py-5">{element}</section>;
};

export default Home;
