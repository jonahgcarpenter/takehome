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
        backgroundColor: "#333",
        color: "#eee",
      }}
    >
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

      <CardContent sx={{ pt: 3, px: 2 }}>
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
