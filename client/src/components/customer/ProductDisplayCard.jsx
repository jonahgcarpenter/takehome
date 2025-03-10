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
    const validValue = Math.min(Math.max(1, newValue), product.quantity);
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

            <Typography
              variant="body2"
              sx={{
                fontWeight: "medium",
                color: product.quantity > 0 ? "success.main" : "error.main",
              }}
            >
              {product.quantity > 0
                ? `In Stock: ${product.quantity}`
                : "Out of Stock"}
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
              max: product.quantity,
              "aria-label": "Quantity",
            }}
            helperText={`Max: ${product.quantity}`}
            InputLabelProps={{ sx: { color: "#ccc" } }}
            FormHelperTextProps={{ sx: { color: "red" } }}
            InputProps={{
              sx: {
                color: "#fff", // ensures the input text is white
              },
            }}
          />

          <IconButton
            color="primary"
            disabled={product.quantity === 0}
            onClick={() => {
              onAddToCart(product, quantity);
              setQuantity(1);
            }}
            sx={{
              backgroundColor: "primary.main",
              color: "#fff",
              "&.Mui-disabled": {
                backgroundColor: "red",
              },
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
