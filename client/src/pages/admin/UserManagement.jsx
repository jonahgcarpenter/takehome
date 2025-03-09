import React, { useState, useCallback } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
} from "@mui/material";

const UserManagement = () => {
  const { users, loading, error, updateUser, deleteUser, fetchUsers } = useUsers();
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
  });
  
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: null
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

  // Handle WebSocket user updates
  const handleUserUpdated = useCallback((updatedUser) => {
    // Refresh the users list when we receive a WebSocket update
    fetchUsers();
    showNotification(
      `User ${updatedUser.email || 'unknown'} has been updated`,
      "info"
    );
  }, [fetchUsers]);

  // Set up WebSocket listeners with proper dependency
  useUserSocket({
    onUserUpdated: handleUserUpdated,
  });

  // Handler functions with improved error messages
  const handleUpdateRole = async (userId, newRole) => {
    try {
      // Ensure the first letter is uppercase for the role
      const formattedRole = newRole.charAt(0).toUpperCase() + newRole.slice(1);
      await updateUser(userId, { role: formattedRole });
      showNotification("User role updated successfully", "success");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update user role";
      showNotification(errorMessage, "error");
    }
  };

  const handleDeleteClick = (userId) => {
    setDeleteDialog({ open: true, userId });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, userId: null });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(deleteDialog.userId);
      showNotification("User deleted successfully", "success");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete user";
      showNotification(errorMessage, "error");
    } finally {
      setDeleteDialog({ open: false, userId: null });
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
            onDelete={handleDeleteClick}
          />
        ))}
      </Box>

      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
