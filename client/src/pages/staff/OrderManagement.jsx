import React, { useState } from "react";
import OrderCard from "../../components/staff/OrderCard";
import OrderForm from "../../components/staff/OrderForm";
import useOrders from "../../hooks/api/useOrders";
import useOrderSocket from "../../hooks/websockets/useOrderSockets";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Divider,
  Snackbar,
  Button,
} from "@mui/material";

const OrderManagement = () => {
  const { orders, loading, error, fetchOrders, updateOrder, deleteOrder } =
    useOrders();
  const [openForm, setOpenForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
  });
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Listen for live updates using the existing hook
  useOrderSocket({
    onOrdersUpdated: (payload) => {
      fetchOrders();
      if (payload.deletedOrder) {
        // For deletion events, extract orderNumber from deletedOrder
        const orderNumber = payload.deletedOrder.orderNumber || payload.id;
        setNotification({
          open: true,
          message: `${orderNumber} deleted`,
          type: "info",
        });
      } else {
        setNotification({
          open: true,
          message: `${payload.orderNumber} updated`,
          type: "info",
        });
      }
    },
  });

  const showNotification = (message, type = "info") => {
    setNotification({ open: true, message, type });
  };

  const handleOpenForm = (order) => {
    setEditingOrder(order);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setEditingOrder(null);
    setOpenForm(false);
  };

  const handleFormSubmit = async (orderData) => {
    try {
      if (editingOrder) {
        await updateOrder(editingOrder._id || editingOrder.id, orderData);
        handleCloseForm();
      }
    } catch (err) {
      showNotification(
        "Error updating order: " + (err.response?.data?.message || err.message),
        "error",
      );
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
    } catch (err) {
      showNotification(
        "Error updating order status: " +
          (err.response?.data?.message || err.message),
        "error",
      );
    }
  };

  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteOrder(orderToDelete);
      showNotification(`Order deleted successfully`, "info");
      setOrderToDelete(null);
      setDeleteDialogOpen(false);
    } catch (err) {
      showNotification(
        "Error deleting order: " + (err.response?.data?.message || err.message),
        "error",
      );
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setOrderToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: "#2C2C2C",
          color: "#eee",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 3, fontWeight: 500, color: "primary.main" }}
        >
          Order Management
        </Typography>
        <Divider sx={{ mb: 3, borderColor: "#444" }} />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : orders.length === 0 ? (
          <Typography sx={{ textAlign: "center", color: "#ccc", my: 4 }}>
            No orders found.
          </Typography>
        ) : (
          <Box>
            {orders.map((order) => (
              <Box key={order._id || order.id} sx={{ mb: 2 }}>
                <OrderCard
                  order={order}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={() => handleDeleteClick(order._id || order.id)}
                  onEdit={() => handleOpenForm(order)}
                />
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: "#2C2C2C", color: "#eee" } }}
      >
        <DialogTitle sx={{ color: "#eee" }}>Edit Order</DialogTitle>
        <DialogContent>
          <OrderForm
            order={editingOrder}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{ sx: { backgroundColor: "#2C2C2C", color: "#eee" } }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ color: "#eee" }}>
          Confirm Delete Order
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="delete-dialog-description"
            sx={{ color: "#fff" }}
          >
            Are you sure you want to delete this order? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete Order
          </Button>
        </DialogActions>
      </Dialog>

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

export default OrderManagement;
