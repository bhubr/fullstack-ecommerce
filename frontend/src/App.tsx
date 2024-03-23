import { Container } from 'reactstrap';

import TopNavbar from './components/TopNavbar';
import Footer from './components/Footer';
import ProductCardList from './components/ProductCardList';

const App = () => {
  return (
    <div>
      <TopNavbar />

      <header className="bg-dark py-5">
        <Container>
          <div className="text-center text-white">
            <h1 className="display-4 fw-bolder">Shop in style</h1>
            <p className="lead fw-normal text-white-50 mb-0">
              With this shop homepage template
            </p>
          </div>
        </Container>
      </header>

      <section className="py-5">
        <ProductCardList products={products} />
      </section>

      <Footer />
    </div>
  );
};

// Sample data for products
const products = [
  {
    name: 'Fancy Product',
    price: '$40.00 - $80.00',
    pictureUrl: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
    buttonText: 'View options',
  },
  {
    name: 'Special Item',
    price: '$18.00',
    oldPrice: '$20.00',
    reviews: 5,
    pictureUrl: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
  },
  {
    name: 'Sale Item',
    price: '$25.00',
    oldPrice: '$50.00',
    sale: true,
    pictureUrl: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
  },
  {
    name: 'Popular Item',
    price: '$40.00',
    reviews: 5,
    pictureUrl: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
  },
  {
    name: 'Sale Item',
    price: '$25.00',
    oldPrice: '$50.00',
    sale: true,
    pictureUrl: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
  },
  {
    name: 'Fancy Product',
    price: '$120.00 - $280.00',
    pictureUrl: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
  },
  {
    name: 'Special Item',
    price: '$18.00',
    oldPrice: '$20.00',
    reviews: 5,
    pictureUrl: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
  },
  {
    name: 'Popular Item',
    price: '$40.00',
    reviews: 5,
    pictureUrl: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg',
  },
];

export default App;
