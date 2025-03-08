import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        quantity: product.quantity || "",
      });
    } else {
      // Reset form if no product is provided
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert price and quantity to numeric values
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
    };
    onSubmit(submitData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Name"
        name="name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.name}
        onChange={handleChange}
        required
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
      />
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
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>
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
