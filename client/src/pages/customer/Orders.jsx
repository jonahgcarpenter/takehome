import React, { useState, useEffect } from "react";
import axios from "axios";
import MyOrders from "../../components/customer/MyOrders";
import { Alert, Snackbar, Container, Box } from "@mui/material";
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
      const sortedOrders = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
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
  const handleOrderCreated = (newOrder) => {
    if (newOrder.customer === localStorage.getItem("userId")) {
      setOrders(prev => [newOrder, ...prev]);
      showNotification(`New order #${newOrder._id.substring(0, 8)} created`, "success");
    }
  };

  const handleOrderUpdated = (updatedOrder) => {
    const existingOrder = orders.find(order => order._id === updatedOrder._id);
    if (existingOrder) {
      setOrders(prev => prev.map(order => 
        order._id === updatedOrder._id ? updatedOrder : order
      ));
      
      if (existingOrder.status !== updatedOrder.status) {
        showNotification(
          `Order #${updatedOrder._id.substring(0, 8)} status changed to ${updatedOrder.status}`,
          "info"
        );
      }
    }
  };

  const handleOrderDeleted = (data) => {
    const existingOrder = orders.find(order => order._id === data.id);
    if (existingOrder) {
      setOrders(prev => prev.filter(order => order._id !== data.id));
      showNotification(`Order #${data.id.substring(0, 8)} has been cancelled`, "warning");
    }
  };

  useOrderSocket({
    onOrderCreated: handleOrderCreated,
    onOrderUpdated: handleOrderUpdated,
    onOrderDeleted: handleOrderDeleted,
  });

  return (
    <Box sx={{ 
      bgcolor: 'background.default',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        <MyOrders orders={orders} loading={loading} error={error} />
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{ 
          '& .MuiAlert-root': {
            width: '100%',
            maxWidth: 400,
          }
        }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.type}
          sx={{ 
            width: '100%',
            boxShadow: 3
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Orders;
