// OrderListContainer.tsx
import { useState, useEffect } from 'react';
import type { AxiosError } from 'axios';

import { readOrders } from '../api'; // Importing the readOrders function
import OrderListDisplay from './OrderListDisplay'; // Importing the OrderDisplay component

const OrderListContainer = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | AxiosError>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedOrders = await readOrders(); // Call the readOrders function
        setOrders(fetchedOrders);
      } catch (err) {
        setError(err as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Call fetchData function on component mount
  }, []);

  return (
    <div>
      {loading ? <p>Loading...</p> : <OrderListDisplay error={error} orders={orders} />}
    </div>
  );
};

export default OrderListContainer;
