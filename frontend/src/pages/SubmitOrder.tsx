import { useContext } from 'react';
import { Button, Container, Col, Row } from 'reactstrap';

import type { ICartItem } from '../types';
import { serverUrl } from '../settings';
import CartContext from '../contexts/CartContext';
import { formatPrice } from '../helpers';
import CheckoutForm from '../components/CheckoutForm';

const OrderItem = ({ item }: { item: ICartItem }) => {
  return (
    <Row>
      <Col xs={{ offset: 2, size: 2 }} className="d-flex align-items-center">
        <div>
          <img
            src={`${serverUrl}${item.product.pictureUrl}`}
            alt={item.product.name}
            style={{ width: '80%' }}
          />
        </div>
      </Col>
      <Col xs="6">
        <div className="py-5">
          <p className="fs-6">{item.product.name}</p>
          {item.quantity} x {formatPrice(item.product.price)}
        </div>
      </Col>
    </Row>
  );
};

const Total = ({ items }: { items: ICartItem[] }) => (
  <>
    {formatPrice(
      items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      )
    )}
  </>
);

const SubmitOrder = () => {
  const { items } = useContext(CartContext);

  return (
    <Container className="my-5">
      <h1 className="flex-grow-1">Finaliser la commande</h1>
      {items.map((item) => (
        <OrderItem key={item.product.id} item={item} />
      ))}
      <Row className="my-2">
        <Col xs={{ offset: 4, size: 8 }}>
          <h2>Récapitulatif</h2>
          <div className="my-2">
            <strong>
              Total : <Total items={items} />
            </strong>
          </div>
        </Col>
      </Row>
      <CheckoutForm />
    </Container>
  );
};

export default SubmitOrder;
