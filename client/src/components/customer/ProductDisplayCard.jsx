import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Box,
  IconButton,
  Paper,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const ProductDisplayCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const newValue = parseInt(e.target.value) || 0;
    const validValue = Math.max(1, newValue);
    setQuantity(validValue);
  };

  return (
    <Paper
      elevation={2}
      sx={{ backgroundColor: "#2C2C2C", color: "#eee", borderRadius: 2 }}
    >
      <Card sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#fff" }}
            >
              {product.name}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2, color: "#ccc" }}>
            {product.description}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              ${product.price.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
          <TextField
            type="number"
            label="Quantity"
            size="small"
            value={quantity}
            onChange={handleQuantityChange}
            sx={{
              width: "100px",
              backgroundColor: "#333",
              borderRadius: 1,
            }}
            inputProps={{
              min: 1,
              "aria-label": "Quantity",
            }}
            InputLabelProps={{ sx: { color: "#ccc" } }}
            InputProps={{
              sx: {
                color: "#fff",
              },
            }}
          />

          <IconButton
            color="primary"
            onClick={() => {
              onAddToCart(product, quantity);
              setQuantity(1);
            }}
            sx={{
              backgroundColor: "primary.main",
              color: "#fff",
            }}
          >
            <AddShoppingCartIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Paper>
  );
};

export default ProductDisplayCard;
