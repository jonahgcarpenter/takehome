import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Box,
} from "@mui/material";

/**
 * ProductCard Component - Displays product information with edit and delete capabilities
 * @param {Object} props
 * @param {Object} props.product - Product information
 * @param {string} props.product.name - Product name
 * @param {string} props.product.description - Product description
 * @param {number} props.product.price - Product price
 * @param {number} props.product.quantity - Available quantity
 * @param {string} [props.product.createdAt] - Creation timestamp
 * @param {string} [props.product.updatedAt] - Last update timestamp
 * @param {Function} props.onEdit - Callback when edit is clicked
 * @param {Function} props.onDelete - Callback when delete is clicked
 */
const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <Card
      sx={{
        marginBottom: 3,
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden",
        backgroundColor: "#333",
        color: "#eee",
      }}
    >
      {/* Product Information Section */}
      <CardContent sx={{ p: 2 }}>
        {/* Product Name and Description */}
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          {product.description}
        </Typography>

        {/* Product Details */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="body1" sx={{ color: "green" }}>
            <strong>Est per unit:</strong> ${product.price}
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: product.quantity === 0 ? "red" : "body1" }}
          >
            {product.quantity === 0
              ? "Out of Stock"
              : `Quantity: ${product.quantity}`}
          </Typography>
        </Box>
        <Divider sx={{ my: 1, borderColor: "#444" }} />
      </CardContent>

      {/* Card Footer - Timestamps and Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
        }}
      >
        {/* Timestamps */}
        <Typography variant="caption" sx={{ color: "#ccc" }}>
          Created:{" "}
          {product.createdAt
            ? new Date(product.createdAt).toLocaleString()
            : "N/A"}{" "}
          || Updated:{" "}
          {product.updatedAt
            ? new Date(product.updatedAt).toLocaleString()
            : "N/A"}
        </Typography>

        {/* Action Buttons */}
        <Box>
          <Button
            size="small"
            variant="outlined"
            onClick={onEdit}
            sx={{ mr: 1, borderColor: "#555", color: "#eee" }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={onDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default ProductCard;
