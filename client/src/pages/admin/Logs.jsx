import React, { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../../services/socketService";
import LogEntry from "../../components/admin/LogEntry";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from "@mui/material";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filterUser, setFilterUser] = useState("");
  // Set default filterRole to "All"
  const [filterRole, setFilterRole] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info", // "info", "success", "error", "warning"
  });
  // Track if we're viewing filtered logs
  const [isFiltered, setIsFiltered] = useState(false);
  // Current filter URL to refresh with socket updates
  const [currentFilterUrl, setCurrentFilterUrl] = useState("/api/logs");

  // Function to fetch logs from the API
  const fetchLogs = async (url = "/api/logs") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(url);
      setLogs(response.data);
      // Store the current filter URL for refreshing when needed
      setCurrentFilterUrl(url);
      // Track if we're using filters or not
      setIsFiltered(url !== "/api/logs");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchLogs();
  }, []);

  // Set up WebSocket listeners for real-time log updates
  useEffect(() => {
    // When logs-cleared event is received (All logs cleared)
    socket.on("logs-cleared", (data) => {
      console.log("Socket: Logs cleared", data);
      setLogs([]);
      showNotification("All logs have been cleared", "info");
    });

    // When a new log entry is created
    // Note: This event might need to be added to your backend
    socket.on("log-created", (newLog) => {
      console.log("Socket: New log entry", newLog);

      // If we're viewing all logs or the log matches our current filter
      if (
        !isFiltered ||
        (filterUser && newLog.user === filterUser) ||
        (filterRole !== "All" && newLog.role === filterRole)
      ) {
        setLogs((prevLogs) => [newLog, ...prevLogs]); // Add new log at the beginning
        showNotification(`New log entry: ${newLog.action}`, "info");
      } else if (isFiltered) {
        // If filtered but doesn't match, notify but don't add
        showNotification(
          "New log entry received (not shown due to active filters)",
          "info",
        );
      }
    });

    // Clean up listeners on component unmount
    return () => {
      socket.off("logs-cleared");
      socket.off("log-created");
    };
  }, [isFiltered, filterUser, filterRole]); // Dependencies for filter-based decisions

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

  // Handle filter form submission
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // If a user ID is provided, filter by user
    if (filterUser) {
      fetchLogs(`/api/logs/user/${filterUser}`);
    }
    // Otherwise, if a specific role is selected (not "All"), filter by role
    else if (filterRole !== "All") {
      fetchLogs(`/api/logs/role/${filterRole}`);
    }
    // Otherwise, fetch all logs
    else {
      fetchLogs();
    }
  };

  // Reset the filters and fetch all logs again
  const resetFilters = () => {
    setFilterUser("");
    setFilterRole("All");
    fetchLogs();
  };

  // Clear all logs via the API
  const handleClearLogs = async () => {
    if (!window.confirm("Are you sure you want to clear all logs?")) return;
    try {
      await axios.delete("/api/logs");
      // The UI will update automatically via the socket event
      showNotification("All logs cleared successfully", "success");
    } catch (err) {
      showNotification(
        "Error clearing logs: " + (err.response?.data?.message || err.message),
        "error",
      );
    }
  };

  // Refresh logs based on current filter
  const handleRefresh = () => {
    fetchLogs(currentFilterUrl);
    showNotification("Logs refreshed", "info");
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Logs
      </Typography>
      <Box component="form" onSubmit={handleFilterSubmit} sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Filter by User ID"
              variant="outlined"
              fullWidth
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="filter-role-label">Filter by Role</InputLabel>
              <Select
                labelId="filter-role-label"
                label="Filter by Role"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Staff">Staff</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
            >
              Apply Filter
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={resetFilters}
              sx={{ mr: 1 }}
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="error" onClick={handleClearLogs}>
          Clear All Logs
        </Button>
      </Box>
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
      {!loading && logs.length === 0 && !error && (
        <Typography>No logs found.</Typography>
      )}
      <Box>
        {logs.map((log) => (
          <LogEntry key={log._id || log.id} log={log} />
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

export default Logs;
