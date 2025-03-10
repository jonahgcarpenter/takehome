import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Button,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Cart = ({
  cartItems,
  onRemove,
  onPlaceOrder,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        position: "sticky",
        top: 20,
        p: 3,
        borderRadius: 2,
        backgroundColor: "#2C2C2C",
        color: "#eee",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        Your Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="body1" sx={{ color: "#ccc" }}>
          Your cart is empty.
        </Typography>
      ) : (
        <>
          <List sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            {cartItems.map((item) => (
              <React.Fragment key={item.product._id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    backgroundColor: "#333",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={item.product.name}
                    secondary={
                      <Typography variant="body2" sx={{ color: "#ccc" }}>
                        Est per unit: <b>${item.product.price.toFixed(2)}</b>
                        <br />
                        Quantity: <b>{item.quantity}</b>
                      </Typography>
                    }
                  />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      onClick={() => onRemove(item.product._id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
          <Divider sx={{ my: 2, borderColor: "#444" }} />
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={onPlaceOrder}
            sx={{
              py: 1.5,
              fontWeight: "bold",
              backgroundColor: "success.main",
              "&:hover": { backgroundColor: "success.dark" },
            }}
          >
            Request Quote
          </Button>
        </>
      )}
    </Paper>
  );
};

export default Cart;
