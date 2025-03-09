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
} from "@mui/material";
import useProducts from "../../hooks/api/useProducts";
import useProductSocket from "../../hooks/websockets/useProductSocket";
import useOrderSocket from "../../hooks/websockets/useOrderSockets";
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

  useOrderSocket({
    onOrderCreated: (newOrder) => {
      setNotification({
        open: true,
        message: `Order ${newOrder._id} created successfully`,
        type: "success",
      });
    },
    onOrderUpdated: () => {},
    onOrderDeleted: () => {},
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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main", mb: 4 }}
      >
        Buy Products
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {productsLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {productsError && <Alert severity="error">{productsError}</Alert>}

          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} key={product._id}>
                <ProductDisplayCard product={product} onAddToCart={addToCart} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
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
                  message: `Order #${response.data._id} placed successfully!`,
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
