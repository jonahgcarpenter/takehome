import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Box,
} from "@mui/material";

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <Card
      sx={{
        marginBottom: 3,
        borderRadius: 2,
        boxShadow: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ backgroundColor: "background.paper", p: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          {product.description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography variant="body1">
            <strong>Price:</strong> ${product.price}
          </Typography>
          <Typography variant="body1">
            <strong>Quantity:</strong> {product.quantity}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
      </CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Created:{" "}
          {product.createdAt
            ? new Date(product.createdAt).toLocaleString()
            : "N/A"}{" "}
          || Updated:{" "}
          {product.updatedAt
            ? new Date(product.updatedAt).toLocaleString()
            : "N/A"}
        </Typography>
        <Box>
          <Button
            size="small"
            variant="outlined"
            onClick={onEdit}
            sx={{ mr: 1 }}
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
