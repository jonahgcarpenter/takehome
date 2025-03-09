import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import useProducts from "../../hooks/api/useProducts";
import useProductSocket from "../../hooks/websockets/useProductSocket";
import ProductDisplayCard from "../../components/customer/ProductDisplayCard";
import Cart from "../../components/customer/Cart";

const Buy = () => {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    fetchProducts,
  } = useProducts();
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
  });
  const [orderLoading, setOrderLoading] = useState(false);

  useProductSocket({
    onProductsUpdated: fetchProducts,
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const addToCart = (product, qty) => {
    const validQty = Math.min(qty, product.quantity);
    const existing = cartItems.find((item) => item.product._id === product._id);

    if (existing) {
      const newQty = existing.quantity + validQty;
      if (newQty > product.quantity) {
        setNotification({
          open: true,
          message: `Cannot add more than ${product.quantity} units`,
          type: "error",
        });
        return;
      }
      setCartItems(
        cartItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: newQty }
            : item,
        ),
      );
    } else {
      setCartItems([...cartItems, { product, quantity: validQty }]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Products Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ mb: 3, fontWeight: 500, color: "primary.main" }}
            >
              Buy Products
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {productsLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            )}
            {productsError && <Alert severity="error">{productsError}</Alert>}

            <Box>
              {products.map((product) => (
                <Box key={product._id} sx={{ mb: 2 }}>
                  <ProductDisplayCard
                    product={product}
                    onAddToCart={addToCart}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Cart Section */}
        <Grid item xs={12} md={4}>
          {/* The Cart component already has its own Paper styling */}
          <Cart
            cartItems={cartItems}
            totalPrice={totalPrice}
            loading={orderLoading}
            onRemove={(productId) =>
              setCartItems(
                cartItems.filter((item) => item.product._id !== productId),
              )
            }
            onPlaceOrder={async () => {
              setOrderLoading(true);
              try {
                const orderData = {
                  products: cartItems.map((item) => ({
                    product: item.product._id,
                    quantity: item.quantity,
                  })),
                  totalPrice: totalPrice,
                };
                const response = await axios.post("/api/orders", orderData);
                setNotification({
                  open: true,
                  message: `${response.data.orderNumber} placed successfully!`,
                  type: "success",
                });
                setCartItems([]);
              } catch (err) {
                setNotification({
                  open: true,
                  message:
                    err.response?.data?.message ||
                    "Failed to place order. Please try again.",
                  type: "error",
                });
              } finally {
                setOrderLoading(false);
              }
            }}
          />
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.type}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Buy;
