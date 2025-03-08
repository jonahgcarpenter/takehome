import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@mui/material";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [filterUser, setFilterUser] = useState("");
  // Set default filterRole to "All"
  const [filterRole, setFilterRole] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch logs from the API
  const fetchLogs = async (url = "/api/logs") => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(url);
      setLogs(response.data);
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
      setLogs([]);
      alert("All logs cleared successfully.");
    } catch (err) {
      alert(
        "Error clearing logs: " + (err.response?.data?.message || err.message),
      );
    }
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
            <Button type="button" variant="outlined" onClick={resetFilters}>
              Reset
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
    </Container>
  );
};

export default Logs;
