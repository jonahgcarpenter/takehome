import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderCard from "../../components/staff/OrderCard";
import OrderForm from "../../components/staff/OrderForm";
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // Fetch orders from the API
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

  useEffect(() => {
    fetchOrders();
  }, []);

  // Open OrderForm for editing an existing order (no add new functionality)
  const handleOpenForm = (order) => {
    setEditingOrder(order);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setEditingOrder(null);
    setOpenForm(false);
  };

  // Handle form submission for updating an order
  const handleFormSubmit = async (orderData) => {
    try {
      if (editingOrder) {
        // Update existing order
        const response = await axios.put(
          `/api/orders/${editingOrder._id || editingOrder.id}`,
          orderData,
        );
        setOrders((prev) =>
          prev.map((order) =>
            order._id === (editingOrder._id || editingOrder.id) ||
            order.id === (editingOrder._id || editingOrder.id)
              ? response.data
              : order,
          ),
        );
      }
      handleCloseForm();
    } catch (err) {
      alert(
        "Error updating order: " + (err.response?.data?.message || err.message),
      );
    }
  };

  // Update order status inline from OrderCard
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId || order.id === orderId ? response.data : order,
        ),
      );
    } catch (err) {
      alert(
        "Error updating order: " + (err.response?.data?.message || err.message),
      );
    }
  };

  // Delete an order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`/api/orders/${orderId}`);
      setOrders((prev) =>
        prev.filter((order) => (order._id || order.id) !== orderId),
      );
    } catch (err) {
      alert(
        "Error deleting order: " + (err.response?.data?.message || err.message),
      );
    }
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      {!loading && orders.length === 0 && !error && (
        <Typography>No orders found.</Typography>
      )}
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} lg={4} key={order._id || order.id}>
            <OrderCard
              order={order}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteOrder}
              onEdit={() => handleOpenForm(order)}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>Edit Order</DialogTitle>
        <DialogContent>
          <OrderForm
            order={editingOrder}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default OrderManagement;
