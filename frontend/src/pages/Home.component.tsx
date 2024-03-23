import { Alert } from 'reactstrap';
import { AxiosError } from 'axios';
import ProductCardList from '../components/ProductCardList';
import { IProduct } from '../types';
import { ReactNode } from 'react';

interface IHomeProps {
  products: null | IProduct[];
  loading: boolean;
  error: null | AxiosError;
}

const Home = ({ products, loading, error }: IHomeProps) => {
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
  if (products !== null) {
    element = <ProductCardList products={products} />;
  }

  return <section className="py-5">{element}</section>;
};

export default Home;
