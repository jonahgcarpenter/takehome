import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../../services/socketService";
import UserCard from "../../components/admin/UserCard";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
} from "@mui/material";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info", // "info", "success", "error", "warning"
  });

  // Fetch all users from the API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Set up WebSocket listeners for real-time user updates
  useEffect(() => {
    // Handle user updates
    socket.on("user-updated", (updatedUser) => {
      console.log("Socket: User updated", updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user,
        ),
      );
      showNotification(
        `User "${updatedUser.name || updatedUser.email}" updated`,
        "info",
      );
    });

    // Handle user role updates
    socket.on("user-role-updated", (updatedUser) => {
      console.log("Socket: User role updated", updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user,
        ),
      );
      showNotification(
        `User "${updatedUser.name || updatedUser.email}" role changed to ${updatedUser.role}`,
        "info",
      );
    });

    // Handle user deletion
    socket.on("user-deleted", (data) => {
      console.log("Socket: User deleted", data);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== data.id));
      showNotification("User has been deleted", "warning");
    });

    // Clean up listeners on component unmount
    return () => {
      socket.off("user-updated");
      socket.off("user-role-updated");
      socket.off("user-deleted");
    };
  }, []); // Empty dependency array means this effect runs once on mount

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

  // Handle updating a user's role via the API
  const handleUpdateRole = async (userId, newRole) => {
    try {
      // Assuming the endpoint is PUT /api/users/:id/role
      await axios.put(`/api/users/${userId}/role`, { role: newRole });
      // UI will update automatically via the socket event
    } catch (err) {
      showNotification(
        "Error updating role: " + (err.response?.data?.message || err.message),
        "error",
      );
    }
  };

  // Handle deleting a user via the API
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/users/${userId}`);
      // UI will update automatically via the socket event
    } catch (err) {
      showNotification(
        "Error deleting user: " + (err.response?.data?.message || err.message),
        "error",
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

      {/* Notification for real-time updates */}
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
