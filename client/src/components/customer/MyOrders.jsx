import React, { useState } from "react";
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardHeader,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

/**
 * Maps order status to Material-UI color
 * @param {string} status - Order status
 * @returns {string} Material-UI color name
 */
const getStatusColor = (status) => {
  const statusMap = {
    pending: "warning",
    processing: "info",
    shipped: "primary",
    delivered: "success",
    cancelled: "error",
    default: "default",
  };
  return statusMap[status?.toLowerCase()] || statusMap.default;
};

/**
 * Formats price to 2 decimal places
 * @param {number} price - Price to format
 * @returns {string} Formatted price
 */
const formatPrice = (price) => {
  return typeof price === "number" ? price.toFixed(2) : "0.00";
};

/**
 * Formats date string to localized format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
const formatDate = (dateString) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  try {
    return new Date(dateString).toLocaleString("en-US", options);
  } catch (e) {
    return dateString;
  }
};

/**
 * EditQuantityDialog Component - Dialog for editing order item quantity
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close dialog callback
 * @param {Object} props.product - Product being edited
 * @param {Function} props.onSubmit - Submit edit callback
 */
const EditQuantityDialog = ({ open, onClose, product, onSubmit }) => {
  // Use useEffect to update quantity when product changes
  React.useEffect(() => {
    if (product) {
      setQuantity(product.quantity);
    }
  }, [product]);

  const [quantity, setQuantity] = useState(0);

  const handleSubmit = () => {
    onSubmit(product.product._id, parseInt(quantity));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ bgcolor: "#333", color: "#fff" }}>
        Edit Quantity: {product?.product?.name}
      </DialogTitle>
      <DialogContent sx={{ bgcolor: "#333", color: "#fff", pt: 2 }}>
        <TextField
          autoFocus
          margin="dense"
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          InputProps={{ inputProps: { min: 1 } }}
          sx={{
            "& .MuiInputBase-input": { color: "#fff" },
            "& .MuiInputLabel-root": { color: "#999" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#666" },
              "&:hover fieldset": { borderColor: "#999" },
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ bgcolor: "#333", color: "#fff" }}>
        <Button onClick={onClose} sx={{ color: "#999" }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * MyOrders Component - Displays user's order history
 * @param {Object} props
 * @param {Array} props.orders - Array of order objects
 * @param {boolean} props.loading - Loading state
 * @param {string} props.error - Error message if any
 * @param {Function} props.onUpdateQuantity - Callback for updating order quantity
 */
const MyOrders = ({ orders, loading, error, onUpdateQuantity }) => {
  const [editDialog, setEditDialog] = useState({ open: false, product: null });

  return (
    <Box>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={40} color="primary" />
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{
            my: 2,
            boxShadow: 1,
            borderRadius: 2,
            backgroundColor: "#333",
            color: "#fff",
          }}
        >
          {error}
        </Alert>
      )}

      {!loading && orders.length === 0 && !error && (
        <Alert
          severity="info"
          sx={{
            my: 2,
            boxShadow: 1,
            borderRadius: 2,
            backgroundColor: "#2C2C2C",
            color: "#fff",
          }}
        >
          You haven't placed any orders yet.
        </Alert>
      )}

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order._id || order.id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 2,
                "&:hover": { boxShadow: 3 },
                transition: "box-shadow 0.3s ease-in-out",
                backgroundColor: "#333",
                color: "#eee",
              }}
            >
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#fff", fontWeight: "bold" }}
                    >
                      {order.orderNumber}
                    </Typography>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{ fontWeight: "medium" }}
                    />
                  </Box>
                }
                subheader={
                  <>
                    Created: {formatDate(order.createdAt)}
                    <br />
                    Last Updated: {formatDate(order.updatedAt)}
                  </>
                }
                sx={{
                  bgcolor: "primary.main",
                  borderBottom: "1px solid #444",
                  px: 2,
                  py: 1,
                }}
              />

              <CardContent sx={{ pt: 3, px: 2 }}>
                <Grid container spacing={2}>
                  {order.products?.map((item, idx) => (
                    <Grid item xs={12} key={idx}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "#2C2C2C",
                          borderRadius: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          {typeof item.product === "object" ? (
                            <>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: "#fff" }}
                              >
                                {item.product.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "#ccc" }}
                              >
                                Quantity: {item.quantity} <br />
                                Est per unit:{" "}
                                <span style={{ color: "#4caf50" }}>
                                  ${item.product.price}
                                </span>
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: "#fff" }}
                              >
                                {item.product}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "#ccc" }}
                              >
                                Quantity: {item.quantity} <br />
                                Est per unit: N/A
                              </Typography>
                            </>
                          )}
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          {order.status === "Pending" && (
                            <IconButton
                              size="small"
                              onClick={() =>
                                setEditDialog({
                                  open: true,
                                  product: item,
                                  orderId: order._id,
                                })
                              }
                              sx={{ color: "primary.main" }}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          <Typography variant="subtitle2" color="primary.main">
                            {typeof item.product === "object"
                              ? `Est Cost: $${formatPrice(item.product.price * item.quantity)}`
                              : "Est Cost: N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box
                  sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: "1px solid #444",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: "#fff" }}>
                    Quoted Cost:
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    {order.totalPrice === 0 || !order.totalPrice
                      ? "Not Set"
                      : `$${formatPrice(order.totalPrice)}`}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <EditQuantityDialog
        open={editDialog.open}
        product={editDialog.product}
        onClose={() => setEditDialog({ open: false, product: null })}
        onSubmit={(productId, quantity) => {
          onUpdateQuantity(editDialog.orderId, productId, quantity);
        }}
      />
    </Box>
  );
};

export default MyOrders;
