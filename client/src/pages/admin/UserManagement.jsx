import React, { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../../components/admin/UserCard";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle updating a user's role via the API
  const handleUpdateRole = async (userId, newRole) => {
    try {
      // Assuming the endpoint is PUT /api/users/:id/role
      await axios.put(`/api/users/${userId}/role`, { role: newRole });
      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId || user.id === userId
            ? { ...user, role: newRole }
            : user,
        ),
      );
    } catch (err) {
      alert(
        "Error updating role: " + (err.response?.data?.message || err.message),
      );
    }
  };

  // Handle deleting a user via the API
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers((prev) =>
        prev.filter((user) => user._id !== userId && user.id !== userId),
      );
    } catch (err) {
      alert(
        "Error deleting user: " + (err.response?.data?.message || err.message),
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
    </Container>
  );
};

export default UserManagement;
