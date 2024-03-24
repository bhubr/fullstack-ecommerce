import { useContext, useMemo } from 'react';
import { Container, Col, Row } from 'reactstrap';

import type { ICartItem } from '../types';
import { serverUrl } from '../settings';
import CartContext from '../contexts/CartContext';
import { formatPrice } from '../helpers';
import CheckoutForm from '../components/CheckoutForm';

import './SubmitOrder.css';

const OrderItem = ({ item }: { item: ICartItem }) => {
  return (
    <Row>
      <Col xs={{ size: 3 }} className="d-flex align-items-center">
        <div>
          <img
            src={`${serverUrl}${item.product.pictureUrl}`}
            alt={item.product.name}
            style={{ width: '80%' }}
          />
        </div>
      </Col>
      <Col xs="9">
        <div className="py-3">
          <p style={{ fontSize: 15 }}>{item.product.name}</p>
          {item.quantity} x {formatPrice(item.product.price)}
        </div>
      </Col>
    </Row>
  );
};

const SummaryItem = ({ label, price }: { label: string; price: number }) => (
  <li>
    <span className="SubmitOrder-label">{label}</span>
    <span className="SubmitOrder-price">{formatPrice(price)}</span>
  </li>
);

const SubmitOrder = () => {
  const { items } = useContext(CartContext);
  const subTotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
    [items]
  );

  return (
    <Container className="my-5">
      <h1 className="flex-grow-1">Finaliser la commande</h1>
      <Row className="my-2">
        <Col md="5">
          <div className="my-4">
            <h4>Récapitulatif</h4>
            <ul>
              <SummaryItem label="Sous-total" price={subTotal} />
              <SummaryItem label="Livraison" price={0} />
              <SummaryItem label="Total" price={subTotal} />
            </ul>
          </div>
          <CheckoutForm />
        </Col>
        <Col md={{ offset: 1, size: 6 }}>
          <h4>Produits</h4>
          {items.map((item) => (
            <OrderItem key={item.product.id} item={item} />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default SubmitOrder;
