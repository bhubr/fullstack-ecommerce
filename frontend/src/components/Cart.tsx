import { useContext } from 'react';
import { Container, Col, Row } from 'reactstrap';

import type { ICartItem } from '../types';
import { serverUrl } from '../settings';
import CartContext from '../contexts/CartContext';
import { formatPrice } from '../helpers';

const CartItem = ({ item }: { item: ICartItem }) => (
  <Container>
    <Row>
      <Col xs="4">
        <img
          src={`${serverUrl}${item.product.pictureUrl}`}
          alt={item.product.name}
          className="img-fluid"
        />
      </Col>
      <Col xs="8">
        <div className="py-5">
          <p>{item.product.name}</p>
          <p>
            {item.quantity} x {formatPrice(item.product.price)}
          </p>
        </div>
      </Col>
    </Row>
  </Container>
);

const Cart = () => {
  const { items } = useContext(CartContext);

  return (
    <div>
      {items.map((item) => (
        <CartItem key={item.product.id} item={item} />
      ))}
    </div>
  );
};

export default Cart;
