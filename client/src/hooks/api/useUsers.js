import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all users (Admin only)
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

  // Fetch a specific user by ID (Admin only)
  const fetchUserById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/users/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a user by ID (Admin only)
  const updateUser = async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`/api/users/${id}`, userData);
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? response.data : user)),
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a user by ID (Admin only)
  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers: useCallback(fetchUsers, []),
    fetchUserById: useCallback(fetchUserById, []),
    updateUser: useCallback(updateUser, []),
    deleteUser: useCallback(deleteUser, []),
  };
};

export default useUsers;
