import React, { useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import useProducts from "../../hooks/api/useProducts";
import useProductSocket from "../../hooks/websockets/useProductSocket";
import ProductDisplayCard from "../../components/customer/ProductDisplayCard";
import Cart from "../../components/customer/Cart";

const Buy = () => {
  const { products, loading, error, setProducts } = useProducts();
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
  });
  const [orderSuccess, setOrderSuccess] = useState("");

  // Helper to show notifications
  const showNotification = (message, type = "info") => {
    setNotification({ open: true, message, type });
  };

  // WebSocket event handlers
  const handleProductCreated = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    showNotification(`New product available: ${newProduct.name}`, "info");
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product,
      ),
    );
  };

  const handleProductDeleted = (data) => {
    setProducts((prev) => prev.filter((product) => product._id !== data.id));
  };

  // Initialize WebSocket listeners for product events
  useProductSocket({
    onProductCreated: handleProductCreated,
    onProductUpdated: handleProductUpdated,
    onProductDeleted: handleProductDeleted,
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Buy Products
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Render product cards */}
      {products.map((product) => (
        <ProductDisplayCard
          key={product._id}
          product={product}
          onAddToCart={(p, qty) => {
            // Simple add-to-cart logic for demonstration purposes
            const existing = cartItems.find(
              (item) => item.product._id === p._id,
            );
            if (existing) {
              const newQty = existing.quantity + qty;
              if (newQty > p.quantity) {
                showNotification(`Only ${p.quantity} units available`, "error");
                return;
              }
              setCartItems(
                cartItems.map((item) =>
                  item.product._id === p._id
                    ? { ...item, quantity: newQty }
                    : item,
                ),
              );
            } else {
              setCartItems([...cartItems, { product: p, quantity: qty }]);
            }
            showNotification(`Added ${qty} ${p.name} to cart`, "success");
          }}
        />
      ))}

      {/* Render Cart */}
      <Cart
        cartItems={cartItems}
        onRemove={(productId) =>
          setCartItems(
            cartItems.filter((item) => item.product._id !== productId),
          )
        }
        onUpdateQuantity={(productId, newQty) =>
          setCartItems(
            cartItems.map((item) =>
              item.product._id === productId
                ? { ...item, quantity: newQty }
                : item,
            ),
          )
        }
        onPlaceOrder={() => {
          // Place order logic here...
          setOrderSuccess("Order placed successfully!");
          showNotification("Order placed successfully!", "success");
          setCartItems([]);
        }}
      />

      {/* Notification Snackbar */}
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

      {orderSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {orderSuccess}
        </Alert>
      )}
    </Container>
  );
};

export default Buy;
