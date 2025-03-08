import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const OrderForm = ({ order, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customer: "",
    totalPrice: "",
    status: "Pending",
    orderItems: [], // each item: { product: "", quantity: "" }
  });

  useEffect(() => {
    if (order) {
      setFormData({
        customer: order.customer || "",
        totalPrice: order.totalPrice || "",
        status: order.status || "Pending",
        orderItems: order.products
          ? order.products.map((item) => ({
              product: item.product,
              quantity: item.quantity,
            }))
          : [],
      });
    } else {
      setFormData({
        customer: "",
        totalPrice: "",
        status: "Pending",
        orderItems: [],
      });
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.orderItems];
    newItems[index][field] = value;
    setFormData((prev) => ({ ...prev, orderItems: newItems }));
  };

  const addOrderItem = () => {
    setFormData((prev) => ({
      ...prev,
      orderItems: [...prev.orderItems, { product: "", quantity: "" }],
    }));
  };

  const removeOrderItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      orderItems: prev.orderItems.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      totalPrice: parseFloat(formData.totalPrice),
      products: formData.orderItems.map((item) => ({
        product: item.product,
        quantity: parseInt(item.quantity, 10),
      })),
    };
    onSubmit(submitData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Customer ID"
        name="customer"
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.customer}
        onChange={handleChange}
        required
      />
      <TextField
        label="Total Price"
        name="totalPrice"
        variant="outlined"
        fullWidth
        margin="normal"
        type="number"
        value={formData.totalPrice}
        onChange={handleChange}
        required
      />
      <FormControl variant="outlined" fullWidth margin="normal">
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          name="status"
          value={formData.status}
          onChange={handleChange}
          label="Status"
          required
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Processing">Processing</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Order Items</Typography>
        {formData.orderItems.map((item, index) => (
          <Grid
            container
            spacing={2}
            alignItems="center"
            key={index}
            sx={{ mt: 1 }}
          >
            <Grid item xs={5}>
              <TextField
                label="Product ID"
                variant="outlined"
                fullWidth
                value={item.product}
                onChange={(e) =>
                  handleItemChange(index, "product", e.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Quantity"
                variant="outlined"
                fullWidth
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton onClick={() => removeOrderItem(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button onClick={addOrderItem} variant="outlined" sx={{ mt: 1 }}>
          Add Order Item
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {order ? "Update Order" : "Create Order"}
        </Button>
      </Box>
    </Box>
  );
};

export default OrderForm;
