import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Box,
  Chip,
} from "@mui/material";

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
 * @returns {string} Formatted price string
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
 * OrderCard Component - Displays order information with edit and delete capabilities
 * @param {Object} props
 * @param {Object} props.order - Order information
 * @param {string} props.order.orderNumber - Unique order identifier
 * @param {string} props.order.status - Current order status
 * @param {string} props.order.createdAt - Creation timestamp
 * @param {string} props.order.updatedAt - Last update timestamp
 * @param {Object|string} props.order.customer - Customer information
 * @param {Array} props.order.products - Array of ordered products
 * @param {number} props.order.totalPrice - Total order price
 * @param {Function} props.onDelete - Callback when delete is clicked
 * @param {Function} props.onEdit - Callback when edit is clicked
 */
const OrderCard = ({ order, onDelete, onEdit }) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        "&:hover": { boxShadow: 3 },
        transition: "box-shadow 0.3s ease-in-out",
        mb: 2,
        backgroundColor: "#333",
        color: "#eee",
      }}
    >
      {/* Order Header with Status */}
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: "bold" }}>
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
            <Typography variant="body2" sx={{ color: "#000" }}>
              Created: {formatDate(order.createdAt)}
            </Typography>
            <Typography variant="body2" sx={{ color: "#000" }}>
              Updated: {formatDate(order.updatedAt)}
            </Typography>
          </>
        }
        sx={{
          bgcolor: "primary.main",
          borderBottom: 1,
          borderColor: "#444",
          px: 2,
          py: 1,
        }}
      />

      {/* Order Content Section */}
      <CardContent sx={{ pt: 3, px: 2 }}>
        {/* Customer Information */}
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Customer:</strong>{" "}
          {order.customer && order.customer.displayName
            ? order.customer.displayName
            : order.customer}
        </Typography>

        {/* Order Items Grid */}
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
                <Box>
                  {typeof item.product === "object" ? (
                    <>
                      <Typography variant="subtitle2">
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#ccc" }}>
                        Quantity: {item.quantity} <br />
                        Est per unit:{" "}
                        <span style={{ color: "#4caf50" }}>
                          ${item.product.price}
                        </span>
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="subtitle2">
                        {item.product}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#ccc" }}>
                        Quantity: {item.quantity} <br />
                        Est per unit: N/A
                      </Typography>
                    </>
                  )}
                </Box>
                {typeof item.product === "object" ? (
                  <Typography variant="subtitle2" color="primary.main">
                    Est Cost: ${formatPrice(item.product.price * item.quantity)}
                  </Typography>
                ) : (
                  <Typography variant="subtitle2" color="primary.main">
                    Est Cost: N/A
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Order Total Section */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: 1,
            borderColor: "#444",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1">Quoted Cost:</Typography>
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

      {/* Action Buttons */}
      <CardActions sx={{ px: 2, py: 1, justifyContent: "flex-end" }}>
        <Button size="small" onClick={onEdit}>
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => onDelete(order._id || order.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default OrderCard;
