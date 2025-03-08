import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const OrderCard = ({ order, onUpdateStatus, onDelete, onEdit }) => {
  const handleStatusChange = (e) => {
    onUpdateStatus(order._id || order.id, e.target.value);
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardHeader
        title={`Order ${order.orderNumber || `#${order._id || order.id}`}`}
        subheader={`Placed on ${new Date(order.createdAt).toLocaleString()}`}
      />
      <CardContent>
        <Typography variant="body2">
          <strong>Customer:</strong> {order.customer}
        </Typography>
        <Typography variant="body2">
          <strong>Total Price:</strong> ${order.totalPrice}
        </Typography>
        <Typography variant="body2">
          <strong>Status:</strong> {order.status}
        </Typography>
        {order.products && order.products.length > 0 && (
          <div>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Products:
            </Typography>
            {order.products.map((item, idx) => (
              <Typography variant="body2" key={idx}>
                - {item.product} (x{item.quantity})
              </Typography>
            ))}
          </div>
        )}
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Last Updated:</strong>{" "}
          {new Date(order.updatedAt).toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <FormControl variant="outlined" size="small">
          <InputLabel id={`order-status-label-${order._id || order.id}`}>
            Status
          </InputLabel>
          <Select
            labelId={`order-status-label-${order._id || order.id}`}
            value={order.status}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Processing">Processing</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <Button size="small" onClick={onEdit}>
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => onDelete(order._id || order.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default OrderCard;
