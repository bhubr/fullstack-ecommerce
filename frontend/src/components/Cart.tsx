import { useContext } from 'react';
import { Button, Container, Col, Row } from 'reactstrap';

import type { ICartItem } from '../types';
import { serverUrl } from '../settings';
import CartContext from '../contexts/CartContext';
import { formatPrice } from '../helpers';

interface IQuantityDropdownProps {
  quantity: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const QuantityDropdown = ({ quantity, onChange }: IQuantityDropdownProps) => (
  <select
    value={quantity}
    className="form-select"
    onChange={onChange}
    style={{ display: 'inline', width: '70px' }}
  >
    {[...Array(10)].map((_, i) => (
      <option key={i} value={i + 1}>
        {i + 1}
      </option>
    ))}
  </select>
);

const CartItem = ({ item }: { item: ICartItem }) => {
  const { removeItem, setItemQuantity } = useContext(CartContext);
  return (
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
          <p>{item.product.description}</p>
          <p>
            Quantité :{' '}
            <QuantityDropdown
              quantity={item.quantity}
              onChange={(e) =>
                setItemQuantity(item.product, Number(e.target.value))
              }
            />{' '}
            x {formatPrice(item.product.price)}
            <Button
              outline
              color="danger"
              className="mx-3"
              onClick={() => removeItem(item.product)}
            >
              Supprimer
            </Button>
          </p>
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

const Cart = () => {
  const { items } = useContext(CartContext);

  return (
    <Container className="my-5">
      <div className="d-flex d-justify-between">
        <h1 className="flex-grow-1">Panier</h1>
        <div className="me-auto">
          <span className="mx-2">
            <Total items={items} />
          </span>
          <Button size="sm" color="primary" className="me-2">
            Commander
          </Button>
        </div>
      </div>
      {items.map((item) => (
        <CartItem key={item.product.id} item={item} />
      ))}
      <Row className="my-2">
        <Col xs={{ offset: 4, size: 8 }}>
          <h2>Récapitulatif</h2>
          <div className="my-2">
            <strong>
              Total : <Total items={items} />
            </strong>
          </div>
          <Button size="lg" color="primary" className="me-2">
            Commander
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
