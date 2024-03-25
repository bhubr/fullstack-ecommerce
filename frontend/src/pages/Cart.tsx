import { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Container, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

import type { ICartItem, IStockInformation } from '../types';
import { serverUrl } from '../settings';
import CartContext from '../contexts/CartContext';
import { formatPrice } from '../helpers';
import { checkCartAvailability } from '../api';

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

const CartItem = ({
  item,
  availabilityInfo,
}: {
  item: ICartItem;
  availabilityInfo: IStockInformation;
}) => {
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
          {availabilityInfo &&
          availabilityInfo.currentStock < availabilityInfo.requestedQuantity ? (
            <p className="text-danger">
              Stock insuffisant (quantité disponible :{' '}
              {availabilityInfo.currentStock}) &mdash; Modifiez la quantité.
            </p>
          ) : null}
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

const OrderButton = ({
  size,
  canCheckout,
}: {
  size: 'sm' | 'lg';
  canCheckout: boolean;
}) =>
  canCheckout ? (
    <Link to="/commande" className={`btn btn-primary btn-${size} me-2`}>
      Commander
    </Link>
  ) : (
    <Button color="secondary" className={`btn-${size} me-2`} disabled>
      Commander
    </Button>
  );

const Cart = () => {
  const { items } = useContext(CartContext);
  const [cartAvailability, setCartAvailability] = useState<IStockInformation[]>(
    []
  );
  // object with productId as key and IStockInformation item as value
  const cartAvailabilityPerProduct = useMemo(
    () =>
      cartAvailability.reduce(
        (acc, stockInfo) => ({
          ...acc,
          [stockInfo.productId]: stockInfo,
        }),
        {} as Record<number, IStockInformation>
      ),
    [cartAvailability]
  );
  const hasAvailabilityIssues = Object.values(cartAvailabilityPerProduct).some(
    (stockInfo) => stockInfo.currentStock < stockInfo.requestedQuantity
  );

  const refreshAvailability = () =>
    checkCartAvailability().then(setCartAvailability);

  useEffect(() => {
    refreshAvailability();
  }, [items]);

  if (items.length === 0) {
    return (
      <Container className="my-5" style={{ minHeight: '70vh' }}>
        <h1 className="flex-grow-1">Panier vide</h1>
        <div className="my-3">
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmZvdWNlZDhyejBncHZwZWc5dzQxM3ZxYmx0N3d2c3llYW51Y2ZpYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1Zbeweu52ZaQE/giphy.gif"
            alt="Panier vide"
          />
        </div>
        <p>
          Votre panier est vide&hellip; mais vous pouvez le remplir{' '}
          <Link to="/">ici</Link> ! 😊
        </p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex d-justify-between">
        <h1 className="flex-grow-1">Panier</h1>
        <div className="me-auto">
          <span className="mx-2">
            <Total items={items} />
          </span>
          <OrderButton size="sm" canCheckout={!hasAvailabilityIssues} />
        </div>
      </div>
      {items.map((item) => (
        <CartItem
          key={item.product.id}
          item={item}
          availabilityInfo={cartAvailabilityPerProduct[item.product.id]}
        />
      ))}
      <Row className="my-2">
        <Col xs={{ offset: 4, size: 8 }}>
          <h2>Récapitulatif</h2>
          <div className="my-2">
            <strong>
              Total : <Total items={items} />
            </strong>
          </div>
          <OrderButton size="lg" canCheckout={!hasAvailabilityIssues} />
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
