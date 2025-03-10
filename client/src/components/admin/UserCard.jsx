import React from "react";
import {
  Card,
  CardHeader,
  CardActions,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Box,
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
    <Card sx={{ marginBottom: 2, backgroundColor: "#333", color: "#eee" }}>
      <CardHeader
        avatar={
          <Avatar
            src={user.profilePhoto}
            alt={user.firstName || user.displayName}
            sx={{ border: "1px solid #555" }}
          />
        }
        title={fullName.trim() || user.displayName}
        subheader={user.email}
        sx={{
          "& .MuiCardHeader-title": {
            color: "#fff",
            fontSize: "1.25rem",
            fontWeight: 600,
          },
          "& .MuiCardHeader-subheader": { color: "#ccc", fontSize: "1rem" },
          padding: "16px",
        }}
      />

      <CardActions
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        {/* Left side: Timestamps */}
        <Box>
          <Typography variant="body2" sx={{ color: "#eee", lineHeight: 1.2 }}>
            <strong>Last Login:</strong>{" "}
            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#eee", lineHeight: 1.2 }}>
            <strong>Updated At:</strong>{" "}
            {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "N/A"}
          </Typography>
        </Box>

        {/* Right side: Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControl
            variant="outlined"
            size="small"
            sx={{ backgroundColor: "#444", borderRadius: 1 }}
          >
            <InputLabel
              id={`role-select-label-${user._id || user.id}`}
              sx={{ color: "#eee" }}
            >
              Role
            </InputLabel>
            <Select
              labelId={`role-select-label-${user._id || user.id}`}
              value={user.role || ""}
              onChange={handleRoleChange}
              label="Role"
              sx={{
                color: "#eee",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#555" },
              }}
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
        </Box>
      </CardActions>
    </Card>
  );
};

export default UserCard;
