import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../../services/socketService";
import MyOrders from "../../components/customer/MyOrders";
import { Alert, Snackbar } from "@mui/material";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info", // "info", "success", "error", "warning"
  });

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

  // Initial data load
  useEffect(() => {
    fetchOrders();
  }, []);

  // Set up WebSocket listeners for real-time order updates
  useEffect(() => {
    // Handle order creation - only show if it matches the current user's orders
    socket.on("order-created", (newOrder) => {
      // This check assumes the backend populates the customer field or matches by session
      // You might need to adjust the logic based on your auth system
      if (newOrder.customer === localStorage.getItem("userId")) {
        console.log("Socket: Your new order received", newOrder);
        setOrders((prevOrders) => [...prevOrders, newOrder]);
        showNotification(
          `New order #${newOrder._id.substring(0, 8)} created`,
          "success",
        );
      }
    });

    // Handle order updates - filter only this user's orders
    socket.on("order-updated", (updatedOrder) => {
      // Check if this order belongs to the current user
      const existingOrder = orders.find(
        (order) => order._id === updatedOrder._id,
      );
      if (existingOrder) {
        console.log("Socket: Your order updated", updatedOrder);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order,
          ),
        );

        // Show notification about status change if status was updated
        if (existingOrder.status !== updatedOrder.status) {
          showNotification(
            `Order #${updatedOrder._id.substring(0, 8)} status changed to ${updatedOrder.status}`,
            "info",
          );
        } else {
          showNotification(
            `Order #${updatedOrder._id.substring(0, 8)} has been updated`,
            "info",
          );
        }
      }
    });

    // Handle order deletion - remove from list if it's this user's order
    socket.on("order-deleted", (data) => {
      const existingOrder = orders.find((order) => order._id === data.id);
      if (existingOrder) {
        console.log("Socket: Your order deleted", data);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== data.id),
        );
        showNotification(
          `Order #${data.id.substring(0, 8)} has been cancelled`,
          "warning",
        );
      }
    });

    // Clean up listeners on component unmount
    return () => {
      socket.off("order-created");
      socket.off("order-updated");
      socket.off("order-deleted");
    };
  }, [orders]); // Depend on orders to access them in handlers

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

  return (
    <>
      <MyOrders orders={orders} loading={loading} error={error} />

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
    </>
  );
};

export default Orders;
