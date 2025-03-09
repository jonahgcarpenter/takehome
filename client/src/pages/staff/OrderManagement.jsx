import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../../services/socketService";
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
  Snackbar,
} from "@mui/material";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info", // "info", "success", "error"
  });

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

  // Setup socket event listeners for real-time updates
  useEffect(() => {
    // Listen for order creation events
    socket.on("order-created", (newOrder) => {
      console.log("Socket: New order created", newOrder);
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      showNotification(
        `New order #${newOrder._id || newOrder.id} created`,
        "success",
      );
    });

    // Listen for order update events
    socket.on("order-updated", (updatedOrder) => {
      console.log("Socket: Order updated", updatedOrder);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        ),
      );
      showNotification(
        `Order #${updatedOrder._id || updatedOrder.id} updated`,
        "info",
      );
    });

    // Listen for order deletion events
    socket.on("order-deleted", (data) => {
      console.log("Socket: Order deleted", data);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== data.id),
      );
      showNotification(`Order #${data.id} deleted`, "info");
    });

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      socket.off("order-created");
      socket.off("order-updated");
      socket.off("order-deleted");
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Display notification
  const showNotification = (message, type = "info") => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Open OrderForm for editing an existing order
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
        await axios.put(
          `/api/orders/${editingOrder._id || editingOrder.id}`,
          orderData,
        );
        // The UI update will happen through the WebSocket event
        handleCloseForm();
      }
    } catch (err) {
      showNotification(
        "Error updating order: " + (err.response?.data?.message || err.message),
        "error",
      );
    }
  };

  // Update order status inline from OrderCard
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}`, {
        status: newStatus,
      });
      // The UI update will happen through the WebSocket event
    } catch (err) {
      showNotification(
        "Error updating order status: " +
          (err.response?.data?.message || err.message),
        "error",
      );
    }
  };

  // Delete an order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`/api/orders/${orderId}`);
      // The UI update will happen through the WebSocket event
    } catch (err) {
      showNotification(
        "Error deleting order: " + (err.response?.data?.message || err.message),
        "error",
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

      {/* Notification for real-time updates */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrderManagement;
