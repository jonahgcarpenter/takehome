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

/**
 * Buy Component - Customer page for browsing products and creating orders
 * Provides product browsing, cart management, and order placement functionality
 */
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

  // Initialize WebSocket connection
  useProductSocket({
    onProductsUpdated: fetchProducts,
  });

  /**
   * Adds or updates product quantity in cart
   * @param {Object} product - Product to add
   * @param {number} qty - Quantity to add
   */
  const addToCart = (product, qty) => {
    const existing = cartItems.find((item) => item.product._id === product._id);

    if (existing) {
      const newQty = existing.quantity + qty;
      setCartItems(
        cartItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: newQty }
            : item,
        ),
      );
    } else {
      setCartItems([...cartItems, { product, quantity: qty }]);
    }
  };

  /**
   * Removes product from cart
   * @param {string} productId - ID of product to remove
   */
  const handleRemove = (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product._id !== productId),
    );
  };

  /**
   * Handles order placement
   * Submits cart items to create new order
   */
  const handlePlaceOrder = async () => {
    setOrderLoading(true);
    try {
      const orderData = {
        products: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
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
  };

  return (
    <Container
      maxWidth="xl" // Make the container wider
      sx={{ py: 4, backgroundColor: "#222", minHeight: "100vh" }}
    >
      <Grid container spacing={3}>
        {/* Products Section */}
        <Grid item xs={12} md={9}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              backgroundColor: "#2C2C2C",
              color: "#eee",
            }}
          >
            {/* Header */}
            <Typography
              variant="h4"
              gutterBottom
              sx={{ mb: 3, fontWeight: 500, color: "primary.main" }}
            >
              Request a Quote
            </Typography>
            <Divider sx={{ mb: 3, borderColor: "#444" }} />

            {/* Loading and Error States */}
            {productsLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            )}
            {productsError && (
              <Alert
                severity="error"
                sx={{ backgroundColor: "#333", color: "#fff", mb: 2 }}
              >
                {productsError}
              </Alert>
            )}

            {/* Products Grid */}
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
        <Grid item xs={12} md={3}>
          <Cart
            cartItems={cartItems}
            loading={orderLoading}
            onRemove={handleRemove}
            onPlaceOrder={handlePlaceOrder}
          />
        </Grid>
      </Grid>

      {/* Notification System */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.type}
          sx={{ width: "100%", backgroundColor: "#333", color: "#fff" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Buy;
