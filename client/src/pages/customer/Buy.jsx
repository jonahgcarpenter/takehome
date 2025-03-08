import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import ProductDisplayCard from "../../components/customer/ProductDisplayCard";
import Cart from "../../components/customer/Cart";

const Buy = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]); // each item: { product, quantity }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState("");

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

  // Handle adding a product to the cart.
  // If the product is already in the cart, update its quantity.
  const handleAddToCart = (product, quantity) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
  };

  // Remove an item from the cart
  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product._id !== productId),
    );
  };

  // Update the quantity for a cart item
  const handleUpdateCartQuantity = (productId, newQuantity) => {
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
      alert("Your cart is empty.");
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
      // Optionally, clear the cart after placing the order.
      setCartItems([]);
    } catch (err) {
      alert(
        "Error placing order: " + (err.response?.data?.message || err.message),
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
    </Container>
  );
};

export default Buy;
