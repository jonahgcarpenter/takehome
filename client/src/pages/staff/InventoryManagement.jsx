import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../../services/socketService";
import ProductCard from "../../components/staff/ProductCard";
import ProductForm from "../../components/staff/ProductForm";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
} from "@mui/material";

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info", // "info", "success", "error"
  });

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Setup socket event listeners
  useEffect(() => {
    // Listen for product creation events
    socket.on("product-created", (newProduct) => {
      console.log("Socket: New product created", newProduct);
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      showNotification(
        `Product "${newProduct.name}" has been added`,
        "success",
      );
    });

    // Listen for product update events
    socket.on("product-updated", (updatedProduct) => {
      console.log("Socket: Product updated", updatedProduct);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p,
        ),
      );
      showNotification(
        `Product "${updatedProduct.name}" has been updated`,
        "success",
      );
    });

    // Listen for product deletion events
    socket.on("product-deleted", (data) => {
      console.log("Socket: Product deleted", data);
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p._id !== data.id),
      );
      showNotification("Product has been deleted", "info");
    });

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      socket.off("product-created");
      socket.off("product-updated");
      socket.off("product-deleted");
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
  }, []);

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

  // Open the form for new product or edit an existing product
  const handleOpenForm = (product = null) => {
    setEditingProduct(product);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    setOpenForm(false);
  };

  // Handle form submission for creating/updating a product
  const handleFormSubmit = async (productData) => {
    try {
      if (editingProduct) {
        // Update product
        await axios.put(
          `/api/products/${editingProduct._id || editingProduct.id}`,
          productData,
        );
        // The UI update will happen through the WebSocket event
      } else {
        // Create product
        await axios.post("/api/products", productData);
        // The UI update will happen through the WebSocket event
      }
      handleCloseForm();
    } catch (err) {
      showNotification(
        "Error submitting product: " +
          (err.response?.data?.message || err.message),
        "error",
      );
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`/api/products/${productId}`);
      // The UI update will happen through the WebSocket event
    } catch (err) {
      showNotification(
        "Error deleting product: " +
          (err.response?.data?.message || err.message),
        "error",
      );
    }
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenForm()}
        >
          Add New Product
        </Button>
      </Box>
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
      {!loading && products.length === 0 && !error && (
        <Typography>No products found.</Typography>
      )}
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} md={6} lg={4} key={product._id || product.id}>
            <ProductCard
              product={product}
              onEdit={() => handleOpenForm(product)}
              onDelete={() => handleDeleteProduct(product._id || product.id)}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent>
          <ProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      {/* Notification for real-time updates */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        message={notification.message}
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

export default InventoryManagement;
