// OrderListDisplay.tsx
import { Alert, Container, Row, Col, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import type { AxiosError } from 'axios';

import { formatDate, formatPrice } from '../helpers/formatters';
import { IOrder } from '../types';

interface OrderListDisplayProps {
  orders: IOrder[];
  error: AxiosError<{ error: string }> | null;
}

const OrderListDisplay = ({ orders, error }: OrderListDisplayProps) => {
  return (
    <Container className="my-5" style={{ minHeight: '70vh' }}>
      <Row>
        <Col xs="12">
          {error && (
            <Alert color="danger">
              {error.response?.data.error || 'Erreur inconnue'}
            </Alert>
          )}
        </Col>
        <Col xs="12" sm={{ offset: 1, size: 10 }} md={{ offset: 2, size: 8 }}>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Référence</th>
                <th>Montant total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <Link to={`/commandes/${order.reference}`}>
                      {order.reference}
                    </Link>
                  </td>
                  <td>{formatPrice(order.subTotal + order.shippingCost)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderListDisplay;
