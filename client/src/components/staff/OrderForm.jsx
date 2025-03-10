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
  Typography,
} from "@mui/material";

/**
 * OrderForm Component - Form for creating and editing orders
 * @param {Object} props
 * @param {Object} [props.order] - Existing order data for editing
 * @param {Function} props.onSubmit - Callback function when form is submitted
 * @param {Function} props.onCancel - Callback function when form is cancelled
 */
const OrderForm = ({ order, onSubmit, onCancel }) => {
  /**
   * Form state with typed structure
   * @type {{
   *   customer: string,
   *   totalPrice: string,
   *   status: string,
   *   orderItems: Array<{product: string|Object, quantity: number}>
   * }}
   */
  const [formData, setFormData] = useState({
    customer: "",
    totalPrice: "",
    status: "Pending",
    orderItems: [], // each item: { product: "", quantity: "" }
  });

  /**
   * Initialize form data when order prop changes
   */
  useEffect(() => {
    if (order) {
      const initialOrderItems = order.products
        ? order.products.map((item) => ({
            product: item.product,
            quantity: item.quantity,
          }))
        : [];
      setFormData({
        customer:
          order.customer && order.customer.displayName
            ? order.customer.displayName
            : order.customer || "",
        totalPrice: order.totalPrice ? order.totalPrice.toString() : "0.00",
        status: order.status || "Pending",
        orderItems: initialOrderItems,
      });
    } else {
      setFormData({
        customer: "",
        totalPrice: "0.00",
        status: "Pending",
        orderItems: [],
      });
    }
  }, [order]);

  /**
   * Handle changes to form fields
   * @param {Object} e - Event object from form input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle changes to order item fields
   * @param {number} index - Index of the item being modified
   * @param {string} field - Field name to update
   * @param {string|number} value - New value for the field
   */
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.orderItems];
    newItems[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      orderItems: newItems,
    }));
  };

  /**
   * Handle form submission
   * @param {Object} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      totalPrice: parseFloat(formData.totalPrice),
      status: formData.status,
      products: formData.orderItems.map((item) => ({
        product:
          typeof item.product === "object" && item.product._id
            ? item.product._id
            : item.product,
        quantity: parseInt(item.quantity, 10),
      })),
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
      {/* Customer Information Section */}
      <Box sx={{ my: 1 }}>
        <Typography variant="subtitle1">
          <strong>Customer:</strong> {formData.customer}
        </Typography>
      </Box>

      {/* Price Input Section */}
      <Box sx={{ my: 1 }}>
        <TextField
          label="Total Price"
          name="totalPrice"
          type="number"
          value={formData.totalPrice}
          onChange={handleChange}
          fullWidth
          required
          InputProps={{
            startAdornment: "$",
            sx: { color: "#eee", backgroundColor: "#333" },
          }}
          InputLabelProps={{ sx: { color: "#ccc" } }}
        />
      </Box>

      {/* Order Status Selection */}
      <FormControl variant="outlined" fullWidth margin="normal">
        <InputLabel id="status-label" sx={{ color: "#ccc" }}>
          Status
        </InputLabel>
        <Select
          labelId="status-label"
          name="status"
          value={formData.status}
          onChange={handleChange}
          label="Status"
          required
          sx={{
            color: "#eee",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
          }}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Processing">Processing</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>

      {/* Order Items Section */}
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
            <Grid item xs={7}>
              <Typography variant="body1">
                {typeof item.product === "object" && item.product.name
                  ? item.product.name
                  : item.product}
              </Typography>
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
                disabled={formData.status !== "Pending"}
                InputProps={{
                  sx: {
                    color: "#eee",
                    backgroundColor:
                      formData.status === "Pending" ? "#333" : "#2a2a2a",
                    "& input:disabled": {
                      color: "#888",
                    },
                  },
                }}
                InputLabelProps={{ sx: { color: "#ccc" } }}
              />
            </Grid>
          </Grid>
        ))}
      </Box>

      {/* Form Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onCancel} sx={{ mr: 1, color: "#eee" }}>
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
