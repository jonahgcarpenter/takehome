import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Divider,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Cart = ({
  cartItems,
  totalPrice,
  onRemove,
  onUpdateQuantity,
  onPlaceOrder,
}) => {
  return (
    <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="body1">Your cart is empty.</Typography>
      ) : (
        <>
          <List>
            {cartItems.map((item) => (
              <React.Fragment key={item.product._id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={item.product.name}
                    secondary={`Price: $${item.product.price.toFixed(2)} | Total: $${(item.product.price * item.quantity).toFixed(2)}`}
                  />
                  <TextField
                    label="Qty"
                    type="number"
                    variant="outlined"
                    size="small"
                    value={item.quantity}
                    onChange={(e) =>
                      onUpdateQuantity(
                        item.product._id,
                        parseInt(e.target.value, 10),
                      )
                    }
                    sx={{ width: 80, mr: 1 }}
                    inputProps={{ min: 1 }}
                  />
                  <IconButton
                    onClick={() => onRemove(item.product._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1">Total Price:</Typography>
            <Typography variant="subtitle1">
              ${totalPrice.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={onPlaceOrder}
          >
            Place Order
          </Button>
        </>
      )}
    </Box>
  );
};

export default Cart;
