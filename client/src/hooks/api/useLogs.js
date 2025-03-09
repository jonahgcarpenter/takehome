import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    loading,
    error,
    fetchLogs: useCallback(fetchLogs, []),
    fetchLogsByUser: useCallback(fetchLogsByUser, []),
    fetchLogsByRole: useCallback(fetchLogsByRole, []),
    clearLogs: useCallback(clearLogs, []),
  };
};

export default useLogs;
