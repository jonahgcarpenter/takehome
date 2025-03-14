import React, { useState, useEffect } from "react";
import { Box, TextField, Button, InputAdornment } from "@mui/material";

/**
 * ProductForm Component - Form for creating and editing products
 * @param {Object} props
 * @param {Object} [props.product] - Existing product data for editing
 * @param {Function} props.onSubmit - Callback function when form is submitted
 * @param {Function} props.onCancel - Callback function when form is cancelled
 */
const ProductForm = ({ product, onSubmit, onCancel }) => {
  /**
   * Form state with typed structure
   * @type {{
   *   name: string,
   *   description: string,
   *   price: string,
   *   quantity: string
   * }}
   */
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  /**
   * Initialize form data when product prop changes
   */
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        quantity: product.quantity || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: "",
      });
    }
  }, [product]);

  /**
   * Handle changes to form fields
   * @param {Object} e - Event object from form input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle form submission with data validation
   * @param {Object} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
    };
    onSubmit(submitData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 2,
        backgroundColor: "#2C2C2C",
        p: 2,
        borderRadius: 1,
        color: "#eee",
      }}
    >
      {/* Product Information Fields */}
      <TextField
        label="Name"
        name="name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.name}
        onChange={handleChange}
        required
        InputProps={{ sx: { color: "#eee", backgroundColor: "#333" } }}
        InputLabelProps={{ sx: { color: "#ccc" } }}
      />
      <TextField
        label="Description"
        name="description"
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.description}
        onChange={handleChange}
        required
        InputProps={{ sx: { color: "#eee", backgroundColor: "#333" } }}
        InputLabelProps={{ sx: { color: "#ccc" } }}
      />

      {/* Price and Quantity Fields */}
      <TextField
        label="Price"
        name="price"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          sx: { color: "#eee", backgroundColor: "#333" },
        }}
        InputLabelProps={{ sx: { color: "#ccc" } }}
      />
      <TextField
        label="Quantity"
        name="quantity"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        required
        InputProps={{ sx: { color: "#eee", backgroundColor: "#333" } }}
        InputLabelProps={{ sx: { color: "#ccc" } }}
      />

      {/* Form Actions */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onCancel} sx={{ mr: 1, color: "#eee" }}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {product ? "Update Product" : "Create Product"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;
