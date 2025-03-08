import React from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardHeader,
  CardContent,
  Divider,
} from "@mui/material";

const MyOrders = ({ orders, loading, error }) => {
  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      {!loading && orders.length === 0 && !error && (
        <Typography>No orders found.</Typography>
      )}
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} md={6} key={order._id || order.id}>
            <Card sx={{ marginBottom: 2 }}>
              <CardHeader
                title={`Order ${order.orderNumber || `#${order._id || order.id}`}`}
                subheader={`Placed on ${new Date(order.createdAt).toLocaleString()}`}
              />
              <CardContent>
                <Typography variant="body2">
                  <strong>Total Price:</strong> ${order.totalPrice}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {order.status}
                </Typography>
                {order.products && order.products.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2">Products:</Typography>
                    {order.products.map((item, idx) => (
                      <Typography variant="body2" key={idx}>
                        - {item.product.name} (x{item.quantity})
                      </Typography>
                    ))}
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                  <strong>Last Updated:</strong>{" "}
                  {new Date(order.updatedAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyOrders;
