// OrderListDisplay.tsx
import { Alert, Container, Row, Col, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { formatDate, formatPrice } from '../helpers';

const OrderListDisplay = ({ orders, error }) => {
  return (
    <Container className="my-5">
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
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{formatDate(order.createdAt)}</td>
                  <td><Link to={`/commandes/${order.reference}`}>{order.reference}</Link></td>
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
