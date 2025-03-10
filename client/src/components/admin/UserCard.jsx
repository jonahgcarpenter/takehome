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

/**
 * UserCard Component - Displays user information with role management capabilities
 * @param {Object} props
 * @param {Object} props.user - User object containing user details
 * @param {string} props.user._id - Unique identifier for the user
 * @param {string} props.user.firstName - User's first name (optional)
 * @param {string} props.user.lastName - User's last name (optional)
 * @param {string} props.user.displayName - User's display name
 * @param {string} props.user.email - User's email address
 * @param {string} props.user.profilePhoto - URL to user's profile photo
 * @param {string} props.user.role - User's current role
 * @param {string} props.user.lastLogin - Timestamp of last login
 * @param {string} props.user.updatedAt - Timestamp of last update
 * @param {Function} props.onDelete - Callback function for user deletion
 * @param {Function} props.onUpdateRole - Callback function for role updates
 */
const UserCard = ({ user, onDelete, onUpdateRole }) => {
  /**
   * Handles role change events and triggers update callback
   * @param {Object} e - Event object from role select
   */
  const handleRoleChange = (e) => {
    if (e.target.value === user.role) return;
    onUpdateRole(user._id || user.id, e.target.value);
  };

  /**
   * Constructs full name from firstName and lastName, falls back to displayName
   */
  const fullName =
    (user.firstName || "") + " " + (user.lastName || "") || user.displayName;

  return (
    <Card sx={{ marginBottom: 2, backgroundColor: "#333", color: "#eee" }}>
      {/* User Profile Header Section */}
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
        {/* User Activity Timestamps Section */}
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

        {/* User Management Controls Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Role Selection Dropdown */}
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

          {/* Delete User Button */}
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
