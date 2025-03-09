import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all orders (Admin/Staff only)
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/orders");
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific order by ID (Admin/Staff only)
  const fetchOrderById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/orders/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all orders by the currently logged-in user
  const fetchMyOrders = async () => {
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

  // Create a new order (Admin/Staff/Customer)
  const createOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/orders", orderData);
      setOrders((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing order (Admin/Staff only)
  const updateOrder = async (id, orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/orders/${id}`, orderData);
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? response.data : order)),
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an existing order (Admin/Staff only)
  const deleteOrder = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders: useCallback(fetchOrders, []),
    fetchOrderById: useCallback(fetchOrderById, []),
    fetchMyOrders: useCallback(fetchMyOrders, []),
    createOrder: useCallback(createOrder, []),
    updateOrder: useCallback(updateOrder, []),
    deleteOrder: useCallback(deleteOrder, []),
  };
};

export default useOrders;
