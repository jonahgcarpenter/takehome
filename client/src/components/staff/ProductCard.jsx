import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {product.description}
        </Typography>
        <Typography variant="body2">
          <strong>Price:</strong> ${product.price}
        </Typography>
        <Typography variant="body2">
          <strong>Quantity:</strong> {product.quantity}
        </Typography>
        <Typography variant="body2">
          <strong>Created At:</strong>{" "}
          {new Date(product.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body2">
          <strong>Updated At:</strong>{" "}
          {new Date(product.updatedAt).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onEdit}>
          Edit
        </Button>
        <Button size="small" color="error" onClick={onDelete}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
