// OrderDetailsDisplay.tsx
import { Alert, Container, Row, Col } from 'reactstrap';
import { useSearchParams } from 'react-router-dom';

import type { IOrder } from '../types';
import { formatPrice } from '../helpers/formatters';

interface IOrderDetailsDisplayProps {
  order: IOrder;
}

const OrderDetailsDisplay = ({ order }: IOrderDetailsDisplayProps) => {
  const [searchParams] = useSearchParams();

  return (
    <Container className="my-5" style={{ minHeight: '70vh' }}>
      <Row>
        <Col xs="12">
          <h2>Commande {order.reference}</h2>
          {searchParams.get('success') === 'true' && (
            <Alert color="success">
              Votre commande a été passée avec succès
            </Alert>
          )}
          <p>Sous-total : {formatPrice(order.subTotal)}</p>
          <p>Livraison : {formatPrice(order.shippingCost)}</p>
          <p>Total : {formatPrice(order.subTotal + order.shippingCost)}</p>
          <h3>Articles</h3>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.product.name} - {formatPrice(item.price)} - Quantity:{' '}
                {item.quantity}
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetailsDisplay;
