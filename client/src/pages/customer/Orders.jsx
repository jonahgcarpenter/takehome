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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const showNotification = (message, type = "info") => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/orders/myorders");
      // Sort orders by date, newest first
      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
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

  // WebSocket handlers
  const handleOrderUpdated = (updatedOrder) => {
    // Check if this event indicates a deletion.
    if (updatedOrder.deletedOrder) {
      // Extract orderNumber from deletedOrder, fallback to the id if not available.
      const orderNumber =
        updatedOrder.deletedOrder.orderNumber || updatedOrder.id;
      setOrders((prev) =>
        prev.filter((order) => order._id !== updatedOrder.id),
      );
      showNotification(`${orderNumber} deleted`, "info");
    } else {
      // Otherwise, it's an update event.
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        ),
      );
      // Optionally show a notification if the status changed.
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

  useOrderSocket({
    onOrdersUpdated: handleOrderUpdated,
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 3, fontWeight: 500, color: "primary.main" }}
        >
          My Orders
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 3 }}>
            {error}
          </Alert>
        ) : orders.length === 0 ? (
          <Typography
            sx={{ textAlign: "center", color: "text.secondary", my: 4 }}
          >
            No orders found.
          </Typography>
        ) : (
          <MyOrders orders={orders} />
        )}
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          "& .MuiAlert-root": {
            width: "100%",
            maxWidth: 400,
          },
        }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.type}
          sx={{
            width: "100%",
            boxShadow: 3,
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Orders;
