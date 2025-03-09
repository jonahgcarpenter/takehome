import React from "react";
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

const MyOrders = ({ orders, loading, error }) => {
  return (
    <Box>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{
            my: 2,
            boxShadow: 1,
            borderRadius: 2,
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
                subheader={formatDate(order.createdAt)}
                sx={{
                  bgcolor: "background.paper",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              />
              <CardContent sx={{ pt: 3 }}>
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
                          {typeof item.product === "object" ? (
                            <>
                              <Typography variant="subtitle2">
                                {item.product.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Quantity: {item.quantity} <br />
                                Price per unit: ${item.product.price}
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Typography variant="subtitle2">
                                {item.product}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Quantity: {item.quantity} <br />
                                Price per unit: N/A
                              </Typography>
                            </>
                          )}
                        </Box>
                        {typeof item.product === "object" ? (
                          <Typography variant="subtitle2" color="primary.main">
                            Cost: $
                            {formatPrice(item.product.price * item.quantity)}
                          </Typography>
                        ) : (
                          <Typography variant="subtitle2" color="primary.main">
                            Cost: N/A
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
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyOrders;
