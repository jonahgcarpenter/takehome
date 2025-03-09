import React, { useState } from "react";
import axios from "axios";
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
import useProducts from "../../hooks/api/useProducts";
import useProductSocket from "../../hooks/websockets/useProductSocket";
import ProductCard from "../../components/staff/ProductCard";
import ProductForm from "../../components/staff/ProductForm";

const InventoryManagement = () => {
  // Use the hook's products, loading, error and fetchProducts
  const { products, loading, error, fetchProducts } = useProducts();
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info", // "info", "success", "error"
  });

  // Use the product socket hook to refresh products when an update occurs.
  useProductSocket({
    onProductsUpdated: () => {
      fetchProducts();
      // Optionally display a generic notification for any update.
      setNotification({
        open: true,
        message: "Product list updated",
        type: "info",
      });
    },
  });

  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const handleOpenForm = (product = null) => {
    setEditingProduct(product);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    setOpenForm(false);
  };

  // On form submission, call the API (the UI will update via the socket event)
  const handleFormSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await axios.put(
          `/api/products/${editingProduct._id || editingProduct.id}`,
          productData,
        );
      } else {
        await axios.post("/api/products", productData);
      }
      handleCloseForm();
    } catch (err) {
      setNotification({
        open: true,
        message:
          "Error submitting product: " +
          (err.response?.data?.message || err.message),
        type: "error",
      });
    }
  };

  // On delete, call the API (the UI will update via the socket event)
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`/api/products/${productId}`);
    } catch (err) {
      setNotification({
        open: true,
        message:
          "Error deleting product: " +
          (err.response?.data?.message || err.message),
        type: "error",
      });
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

export default InventoryManagement;
