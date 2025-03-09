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
  Avatar,
} from "@mui/material";

const UserCard = ({ user, onDelete, onUpdateRole }) => {
  const handleRoleChange = (e) => {
    if (e.target.value === user.role) return;
    onUpdateRole(user._id || user.id, e.target.value);
  };

  // Use firstName and lastName if available; otherwise, fallback to displayName
  const fullName =
    (user.firstName || "") + " " + (user.lastName || "") || user.displayName;

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardHeader
        avatar={
          <Avatar
            src={user.profilePhoto}
            alt={user.firstName || user.displayName}
          />
        }
        title={fullName.trim() || user.displayName}
        subheader={user.email}
      />
      <CardContent>
        <Typography variant="body2">
          <strong>Last Login:</strong>{" "}
          {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
        </Typography>
        <Typography variant="body2">
          <strong>Updated At:</strong>{" "}
          {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
        </Typography>
      </CardContent>
      <CardActions>
        <FormControl variant="outlined" size="small">
          <InputLabel id={`role-select-label-${user._id || user.id}`}>
            Role
          </InputLabel>
          <Select
            labelId={`role-select-label-${user._id || user.id}`}
            value={user.role || ''}
            onChange={handleRoleChange}
            label="Role"
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Staff">Staff</MenuItem>
            <MenuItem value="Customer">Customer</MenuItem>
          </Select>
        </FormControl>
        <Button
          size="small"
          color="error"
          onClick={() => onDelete(user._id || user.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default UserCard;
