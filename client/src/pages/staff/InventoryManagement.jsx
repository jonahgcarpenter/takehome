import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  useEffect(() => {
    fetchProducts();
  }, []);

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
        const response = await axios.put(
          `/api/products/${editingProduct._id || editingProduct.id}`,
          productData,
        );
        setProducts((prev) =>
          prev.map((p) =>
            p._id === editingProduct._id || p.id === editingProduct.id
              ? response.data
              : p,
          ),
        );
      } else {
        // Create product
        const response = await axios.post("/api/products", productData);
        setProducts((prev) => [...prev, response.data]);
      }
      handleCloseForm();
    } catch (err) {
      alert(
        "Error submitting product: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  // Handle deleting a product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`/api/products/${productId}`);
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));
    } catch (err) {
      alert(
        "Error deleting product: " +
          (err.response?.data?.message || err.message),
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
    </Container>
  );
};

export default InventoryManagement;
