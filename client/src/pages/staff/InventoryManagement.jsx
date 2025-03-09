import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  Divider,
  Snackbar,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import useProducts from "../../hooks/api/useProducts";
import useProductSocket from "../../hooks/websockets/useProductSocket";
import ProductCard from "../../components/staff/ProductCard";
import ProductForm from "../../components/staff/ProductForm";

const InventoryManagement = () => {
  const {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
  });
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Use the product socket hook to refresh products when an update occurs.
  useProductSocket({
    onProductsUpdated: () => {
      fetchProducts();
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

  // Use the hook's createProduct and updateProduct methods
  const handleFormSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(
          editingProduct._id || editingProduct.id,
          productData,
        );
      } else {
        await createProduct(productData);
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

  // Use the hook's deleteProduct method
  const handleDeleteProduct = async (productId) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(productToDelete);
      setNotification({
        open: true,
        message: "Product deleted successfully",
        type: "info",
      });
      setProductToDelete(null);
      setDeleteDialogOpen(false);
    } catch (err) {
      setNotification({
        open: true,
        message:
          "Error deleting product: " +
          (err.response?.data?.message || err.message),
        type: "error",
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setProductToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 3, fontWeight: 500, color: "primary.main" }}
        >
          Inventory Management
        </Typography>
        <Divider sx={{ mb: 3 }} />
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
        <Box>
          {products.map((product) => (
            <Box key={product._id || product.id} sx={{ mb: 2 }}>
              <ProductCard
                product={product}
                onEdit={() => handleOpenForm(product)}
                onDelete={() => handleDeleteProduct(product._id || product.id)}
              />
            </Box>
          ))}
        </Box>
      </Paper>

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

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete Product
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete Product
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          "& .MuiAlert-root": {
            width: "100%",
            maxWidth: 400,
          },
        }}
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
