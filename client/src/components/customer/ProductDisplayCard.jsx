import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  IconButton,
  Paper,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductDisplayCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const newValue = parseInt(e.target.value) || 0;
    const validValue = Math.min(Math.max(1, newValue), product.quantity);
    setQuantity(validValue);
  };

  return (
    <Paper elevation={2}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.name}
            </Typography>
            <Typography 
              variant="body2" 
              color={product.quantity > 0 ? "success.main" : "error.main"}
              sx={{ fontWeight: 'medium' }}
            >
              {product.quantity > 0 ? `In Stock: ${product.quantity}` : 'Out of Stock'}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
              ${product.price.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
          <TextField
            type="number"
            label="Quantity"
            size="small"
            value={quantity}
            onChange={handleQuantityChange}
            sx={{ width: '100px' }}
            inputProps={{ 
              min: 1, 
              max: product.quantity,
              'aria-label': 'Quantity'
            }}
            helperText={`Max: ${product.quantity}`}
          />
          <IconButton
            color="primary"
            disabled={product.quantity === 0}
            onClick={() => {
              onAddToCart(product, quantity);
              setQuantity(1);
            }}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&.Mui-disabled': {
                backgroundColor: 'action.disabledBackground',
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
