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

const formatPrice = (price) => {
  return typeof price === "number" ? price.toFixed(2) : "0.00";
};

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

const OrderCard = ({ order, onDelete, onEdit }) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        "&:hover": { boxShadow: 3 },
        transition: "box-shadow 0.3s ease-in-out",
        mb: 2,
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6">{order.orderNumber}</Typography>
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
            <Typography variant="body2" color="text.secondary">
              Created: {formatDate(order.createdAt)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Updated: {formatDate(order.updatedAt)}
            </Typography>
          </>
        }
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      />

      <CardContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Customer:</strong>{" "}
          {order.customer && order.customer.displayName
            ? order.customer.displayName
            : order.customer}
        </Typography>
        <Grid container spacing={2}>
          {order.products?.map((item, idx) => (
            <Grid item xs={12} key={idx}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle2">
                    {item.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity} <br />
                    Price per unit: ${item.product.price}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" color="primary.main">
                  Cost: ${formatPrice(item.product.price * item.quantity)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1">Total Amount:</Typography>
          <Typography
            variant="h6"
            color="primary.main"
            sx={{ fontWeight: "bold" }}
          >
            ${formatPrice(order.totalPrice)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
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
