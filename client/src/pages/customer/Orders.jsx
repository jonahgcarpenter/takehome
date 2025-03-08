// Orders.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import MyOrders from "../../components/customer/MyOrders";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch orders for the current user
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/orders/myorders");
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return <MyOrders orders={orders} loading={loading} error={error} />;
};

export default Orders;
