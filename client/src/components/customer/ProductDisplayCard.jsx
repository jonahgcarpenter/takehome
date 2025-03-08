import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";

const ProductDisplayCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (quantity > 0) {
      onAddToCart(product, quantity);
      setQuantity(1); // Reset quantity after adding
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Price: ${product.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <TextField
            type="number"
            label="Qty"
            variant="outlined"
            size="small"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            sx={{ width: 80 }}
            inputProps={{ min: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            sx={{ ml: 1 }}
          >
            Add to Cart
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ProductDisplayCard;
