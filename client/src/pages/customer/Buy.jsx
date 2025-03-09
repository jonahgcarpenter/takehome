import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../../services/socketService";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import ProductDisplayCard from "../../components/customer/ProductDisplayCard";
import Cart from "../../components/customer/Cart";

const Buy = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]); // each item: { product, quantity }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info", // "info", "success", "error", "warning"
  });

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Set up WebSocket listeners for real-time product updates
  useEffect(() => {
    // Handle product creation
    socket.on("product-created", (newProduct) => {
      console.log("Socket: New product available:", newProduct);
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      showNotification(`New product available: ${newProduct.name}`, "info");
    });

    // Handle product updates
    socket.on("product-updated", (updatedProduct) => {
      console.log("Socket: Product updated:", updatedProduct);

      // Update products list
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product,
        ),
      );

      // If the updated product is in the cart, update it there too
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) => {
          if (item.product._id === updatedProduct._id) {
            // If the product's price changed
            if (item.product.price !== updatedProduct.price) {
              showNotification(
                `Price changed for ${updatedProduct.name} in your cart`,
                "warning",
              );
            }
            // If the product's quantity is now less than what's in cart
            if (updatedProduct.quantity < item.quantity) {
              const newQuantity = Math.min(
                item.quantity,
                updatedProduct.quantity,
              );
              showNotification(
                `Only ${updatedProduct.quantity} units of ${updatedProduct.name} available`,
                "warning",
              );
              return {
                ...item,
                product: updatedProduct,
                quantity: newQuantity,
              };
            }
            return { ...item, product: updatedProduct };
          }
          return item;
        }),
      );
    });

    // Handle product deletion
    socket.on("product-deleted", (data) => {
      console.log("Socket: Product removed:", data);

      // Check if deleted product is in cart
      const productInCart = cartItems.find(
        (item) => item.product._id === data.id,
      );
      if (productInCart) {
        showNotification(
          `${productInCart.product.name} has been removed from the store and your cart`,
          "error",
        );
        // Remove from cart
        setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item.product._id !== data.id),
        );
      }

      // Remove from products list
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== data.id),
      );
    });

    // Handle order confirmation
    socket.on("order-created", (order) => {
      // Only show notification if it's the current user's order
      // This would need to match the user ID if you have authentication
      if (order._id && orderSuccess) {
        showNotification(
          `Order #${order._id.substring(0, 8)} confirmed!`,
          "success",
        );
      }
    });

    // Clean up listeners on component unmount
    return () => {
      socket.off("product-created");
      socket.off("product-updated");
      socket.off("product-deleted");
      socket.off("order-created");
    };
  }, [cartItems, orderSuccess]); // Dependencies include cartItems to access them in handlers

  // Display notification
  const showNotification = (message, type = "info") => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Handle adding a product to the cart.
  // If the product is already in the cart, update its quantity.
  const handleAddToCart = (product, quantity) => {
    // Check if there's enough quantity available
    if (product.quantity < quantity) {
      showNotification(
        `Sorry, only ${product.quantity} units of ${product.name} are available`,
        "error",
      );
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        // Check if total quantity would exceed available stock
        const newQuantity = existing.quantity + quantity;
        if (newQuantity > product.quantity) {
          showNotification(
            `Sorry, only ${product.quantity} units of ${product.name} are available`,
            "error",
          );
          return prev;
        }

        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: newQuantity }
            : item,
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });

    showNotification(`Added ${quantity} ${product.name} to cart`, "success");
  };

  // Remove an item from the cart
  const handleRemoveFromCart = (productId) => {
    const itemToRemove = cartItems.find(
      (item) => item.product._id === productId,
    );
    if (itemToRemove) {
      showNotification(
        `Removed ${itemToRemove.product.name} from cart`,
        "info",
      );
    }

    setCartItems((prev) =>
      prev.filter((item) => item.product._id !== productId),
    );
  };

  // Update the quantity for a cart item
  const handleUpdateCartQuantity = (productId, newQuantity) => {
    // Find the product to check available quantity
    const product = products.find((p) => p._id === productId);
    if (product && newQuantity > product.quantity) {
      showNotification(
        `Sorry, only ${product.quantity} units of ${product.name} are available`,
        "error",
      );

      // Set to maximum available quantity instead
      newQuantity = product.quantity;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  // Compute total price dynamically (automatically updates when cart changes)
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  // Handle placing an order using the current cart items.
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      showNotification("Your cart is empty", "error");
      return;
    }
    try {
      const orderPayload = {
        totalPrice,
        products: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
      };
      await axios.post("/api/orders", orderPayload);
      setOrderSuccess("Order placed successfully!");
      showNotification("Order placed successfully!", "success");
      // Clear the cart after placing the order.
      setCartItems([]);
    } catch (err) {
      showNotification(
        "Error placing order: " + (err.response?.data?.message || err.message),
        "error",
      );
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Buy Products
      </Typography>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={2}>
        {/* Left side: Product display */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} key={product._id}>
                <ProductDisplayCard
                  product={product}
                  // When a product is added, this callback is called with product and quantity
                  onAddToCart={handleAddToCart}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        {/* Right side: Cart */}
        <Grid item xs={12} md={4}>
          <Cart
            cartItems={cartItems}
            totalPrice={totalPrice}
            onRemove={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onPlaceOrder={handlePlaceOrder}
          />
        </Grid>
      </Grid>
      {orderSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {orderSuccess}
        </Alert>
      )}

      {/* Notification for real-time updates */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
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
