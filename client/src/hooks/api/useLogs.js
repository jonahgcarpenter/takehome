import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterUser, setFilterUser] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [isFiltered, setIsFiltered] = useState(false);

  // Fetch all logs (Admin only)
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/logs");
      setLogs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs by user ID (Admin only)
  const fetchLogsByUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/logs/user/${userId}`);
      setLogs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs by role (Admin only)
  const fetchLogsByRole = async (role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/logs/role/${role}`);
      setLogs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear all logs (Admin only)
  const clearLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete("/api/logs");
      setLogs([]);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback((filterData) => {
    const { user, role } = filterData;
    if (user) {
      fetchLogsByUser(user);
      setIsFiltered(true);
    } else if (role !== "All") {
      fetchLogsByRole(role);
      setIsFiltered(true);
    } else {
      fetchLogs();
      setIsFiltered(false);
    }
  }, []);

  const resetFilters = useCallback(() => {
    setFilterUser("");
    setFilterRole("All");
    setIsFiltered(false);
    fetchLogs();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    setLogs,
    loading,
    error,
    filterUser,
    setFilterUser,
    filterRole,
    setFilterRole,
    isFiltered,
    fetchLogs: useCallback(fetchLogs, []),
    fetchLogsByUser: useCallback(fetchLogsByUser, []),
    fetchLogsByRole: useCallback(fetchLogsByRole, []),
    clearLogs: useCallback(clearLogs, []),
    applyFilters,
    resetFilters,
  };
};

export default useLogs;
