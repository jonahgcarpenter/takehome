import React, { useState } from "react";
import UserCard from "../../components/admin/UserCard";
import useUsers from "../../hooks/api/useUsers";
import useUserSocket from "../../hooks/websockets/useUserSockets";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";

const UserManagement = () => {
  const { users, loading, error, updateUserRole, deleteUser } = useUsers();
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
  });

  // Display notification
  const showNotification = (message, type = "info") => {
    setNotification({
      open: true,
      message,
      type,
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  // Socket handlers
  const handleUserUpdated = (updatedUser) => {
    showNotification(
      `User "${updatedUser.name || updatedUser.email}" updated`,
      "info"
    );
  };

  const handleUserRoleUpdated = (updatedUser) => {
    showNotification(
      `User "${updatedUser.name || updatedUser.email}" role changed to ${updatedUser.role}`,
      "info"
    );
  };

  const handleUserDeleted = () => {
    showNotification("User has been deleted", "warning");
  };

  // Set up WebSocket listeners
  useUserSocket({
    onUserUpdated: handleUserUpdated,
    onUserRoleUpdated: handleUserRoleUpdated,
    onUserDeleted: handleUserDeleted,
    onUserCreated: () => {} // Not needed for this component
  });

  // Handler functions
  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
    } catch (err) {
      showNotification(
        "Error updating role: " + (err.response?.data?.message || err.message),
        "error"
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
    } catch (err) {
      showNotification(
        "Error deleting user: " + (err.response?.data?.message || err.message),
        "error"
      );
    }
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      {!loading && !error && users.length === 0 && (
        <Typography>No users found.</Typography>
      )}
      <Box>
        {users.map((user) => (
          <UserCard
            key={user._id || user.id}
            user={user}
            onUpdateRole={handleUpdateRole}
            onDelete={handleDeleteUser}
          />
        ))}
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserManagement;
