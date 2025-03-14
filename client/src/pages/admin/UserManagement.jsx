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
  Paper,
  Divider,
} from "@mui/material";

/**
 * UserManagement Component - Admin page for managing user accounts
 * Provides functionality for viewing, updating roles, and deleting users
 */
const UserManagement = () => {
  const { users, loading, error, updateUser, deleteUser, fetchUsers } =
    useUsers();
  
  /**
   * State for managing notifications and delete confirmations
   * @type {{ open: boolean, message: string, type: string }}
   */
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
  });

  /**
   * State for managing delete confirmation dialog
   * @type {{ open: boolean, userId: string|null }}
   */
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: null,
  });

  /**
   * Displays a notification message
   * @param {string} message - Message to display
   * @param {string} type - Type of notification (success, error, info)
   */
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

  /**
   * Handles WebSocket user updates
   */
  const handleUserUpdated = useCallback(
    (updatedUser) => {
      // Refresh the users list when we receive a WebSocket update
      fetchUsers();
      showNotification(
        `User ${updatedUser.email || "unknown"} has been updated`,
        "info",
      );
    },
    [fetchUsers],
  );

  // Set up WebSocket listeners with proper dependency
  useUserSocket({
    onUsersUpdated: handleUserUpdated,
  });

  /**
   * Updates user role with error handling
   * @param {string} userId - ID of user to update
   * @param {string} newRole - New role to assign
   */
  const handleUpdateRole = async (userId, newRole) => {
    try {
      // Ensure the first letter is uppercase for the role
      const formattedRole = newRole.charAt(0).toUpperCase() + newRole.slice(1);
      await updateUser(userId, { role: formattedRole });
      showNotification("User role updated successfully", "success");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update user role";
      showNotification(errorMessage, "error");
    }
  };

  /**
   * Opens delete confirmation dialog
   * @param {string} userId - ID of user to delete
   */
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
      const errorMessage =
        err.response?.data?.message || "Failed to delete user";
      showNotification(errorMessage, "error");
    } finally {
      setDeleteDialog({ open: false, userId: null });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Main Content Paper */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: "#2C2C2C",
          color: "#eee",
        }}
      >
        {/* Header Section */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 3, fontWeight: 500, color: "primary.main" }}
        >
          User Management
        </Typography>
        <Divider sx={{ mb: 3, borderColor: "#444" }} />
        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        )}
        {error && (
          <Alert
            severity="error"
            sx={{ my: 3, backgroundColor: "#333", color: "#fff" }}
          >
            {error}
          </Alert>
        )}
        {!loading && !error && users.length === 0 && (
          <Typography sx={{ textAlign: "center", color: "#ccc", my: 4 }}>
            No users found.
          </Typography>
        )}
        {/* User Cards Grid */}
        <Box
          sx={{
            backgroundColor: "#2C2C2C",
            borderRadius: 1,
            py: 2,
            "& > *": { mb: 2 },
            "& > *:last-child": { mb: 0 },
          }}
        >
          {users.map((user) => (
            <UserCard
              key={user._id || user.id}
              user={user}
              onUpdateRole={handleUpdateRole}
              onDelete={handleDeleteClick}
            />
          ))}
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            backgroundColor: "#2C2C2C",
            color: "#eee",
          },
        }}
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="delete-dialog-description"
            sx={{ color: "#fff" }}
          >
            Are you sure you want to delete this user? This action cannot be
            undone.
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

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          sx={{ width: "100%", backgroundColor: "#333", color: "#fff" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserManagement;
