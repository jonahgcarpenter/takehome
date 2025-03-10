import React, { useState, useEffect } from "react";
import axios from "axios";
import MyOrders from "../../components/customer/MyOrders";
import {
  Alert,
  Snackbar,
  Container,
  Box,
  Paper,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import useOrderSocket from "../../hooks/websockets/useOrderSockets";

/**
 * Orders Component - Customer page for viewing and managing their orders
 * Provides real-time order updates and quantity modification functionality
 */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
  });

  /**
   * Shows notification message
   * @param {string} message - Message to display
   * @param {string} type - Type of notification (success, error, info)
   */
  const showNotification = (message, type = "info") => {
    setNotification({ open: true, message, type });
  };

  /**
   * Fetches user's orders from the server
   */
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/orders/myorders");
      // Sort orders by date, newest first, and replace null product fields inline
      const sortedOrders = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((order) => {
          if (order.products && Array.isArray(order.products)) {
            order.products = order.products.map((item) =>
              item.product === null
                ? { ...item, product: "DELETED PRODUCT" }
                : item,
            );
          }
          return order;
        });
      setOrders(sortedOrders);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * Handles real-time order updates from WebSocket
   * @param {Object} updatedOrder - Updated order information
   */
  const handleOrderUpdated = (updatedOrder) => {
    if (!updatedOrder || Object.keys(updatedOrder).length === 0) {
      fetchOrders();
      return;
    }

    if (updatedOrder.deletedOrder) {
      const orderNumber =
        updatedOrder.deletedOrder.orderNumber || updatedOrder.id;
      setOrders((prev) =>
        prev.filter((order) => order._id !== updatedOrder.id),
      );
      showNotification(`${orderNumber} deleted`, "info");
    } else {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        ),
      );
      const existingOrder = orders.find(
        (order) => order._id === updatedOrder._id,
      );
      if (existingOrder && existingOrder.status !== updatedOrder.status) {
        showNotification(
          `${updatedOrder.orderNumber} status changed to ${updatedOrder.status}`,
          "info",
        );
      }
    }
  };

  /**
   * Updates order item quantity
   * @param {string} orderId - Order identifier
   * @param {string} productId - Product identifier
   * @param {number} quantity - New quantity
   */
  const handleUpdateQuantity = async (orderId, productId, quantity) => {
    try {
      const updatedProducts = orders
        .find((order) => order._id === orderId)
        .products.map((item) => ({
          product: item.product._id,
          quantity: item.product._id === productId ? quantity : item.quantity,
        }));

      await axios.put(`/api/orders/myorders/${orderId}`, {
        products: updatedProducts,
      });

      showNotification("Quantity updated successfully", "success");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to update quantity",
        "error",
      );
    }
  };

  // Initialize WebSocket connection
  useOrderSocket({
    onOrdersUpdated: handleOrderUpdated,
  });

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Main Content Paper */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: "#2C2C2C",
          color: "#eee",
        }}
      >
        {/* Header Section */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 3, fontWeight: 500, color: "primary.main" }}
        >
          My Orders
        </Typography>
        <Divider sx={{ mb: 3, borderColor: "#444" }} />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{ my: 3, backgroundColor: "#333", color: "#fff" }}
          >
            {error}
          </Alert>
        ) : orders.length === 0 ? (
          <Typography sx={{ textAlign: "center", color: "#fff", my: 4 }}>
            No orders found.
          </Typography>
        ) : (
          <MyOrders orders={orders} onUpdateQuantity={handleUpdateQuantity} />
        )}
      </Paper>

      {/* Notification System */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          "& .MuiAlert-root": {
            width: "100%",
            maxWidth: 400,
            backgroundColor: "#333",
            color: "#fff",
          },
        }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.type}
          sx={{ width: "100%", boxShadow: 3 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Orders;
