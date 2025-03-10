import React, { useMemo } from "react";
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
  totalPrice: externalTotalPrice,
  onRemove,
  onPlaceOrder,
}) => {
  const calculatedTotalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    [cartItems],
  );

  const totalPrice = externalTotalPrice ?? calculatedTotalPrice;

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
                        Price: <b>${item.product.price.toFixed(2)}</b>
                        <br />
                        Quantity: <b>{item.quantity}</b>
                        <br />
                        Total:{" "}
                        <b>
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </b>
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
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Total:</Typography>
            <Typography
              variant="h6"
              color="primary.main"
              sx={{ fontWeight: "bold" }}
            >
              ${totalPrice.toFixed(2)}
            </Typography>
          </Box>
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
            Place Order
          </Button>
        </>
      )}
    </Paper>
  );
};

export default Cart;
