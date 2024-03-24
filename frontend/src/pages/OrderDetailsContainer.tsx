// OrderDetailsContainer.tsx
import { useState, useEffect } from 'react';
import { Alert, Container } from 'reactstrap';
import { useParams } from 'react-router-dom'; // Importing the useParams hook
import type { AxiosError } from 'axios';

import type { IOrder } from '../types';
import { readOrderByReference } from '../api'; // Importing the readOrderByReference function
import OrderDetailsDisplay from './OrderDetailsDisplay'; // Importing the OrderDetailsDisplay component

const OrderDetailsContainer = () => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [error, setError] = useState<AxiosError<{ error: string }> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const { reference } = useParams();

  useEffect(() => {
    if (!reference) {
      return;
    }
    const fetchData = async () => {
      try {
        const fetchedOrder = await readOrderByReference(reference); // Call the readOrderByReference function
        setOrder(fetchedOrder);
      } catch (error) {
        setError(error as AxiosError<{ error: string }>);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call fetchData function on component mount
  }, [reference]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <Container>
        <Alert color="danger">
          {error.response?.data?.error || "Une erreur s'est produite"}
        </Alert>
      </Container>
    );
  }
  if (!order) {
    return <Alert color="warning">Commande non trouvée</Alert>;
  }

  return <OrderDetailsDisplay order={order} />;
};

export default OrderDetailsContainer;
