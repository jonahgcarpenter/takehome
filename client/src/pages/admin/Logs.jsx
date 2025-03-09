import React, { useState } from "react";
import LogEntry from "../../components/admin/LogEntry";
import useLogs from "../../hooks/api/useLogs";
import useLogSocket from "../../hooks/websockets/useLogSockets";
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
  const [filterUser, setFilterUser] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [isFiltered, setIsFiltered] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const {
    logs,
    setLogs,
    loading,
    error,
    fetchLogs,
    fetchLogsByUser,
    fetchLogsByRole,
    clearLogs,
  } = useLogs();

  const {
    notification: socketNotification,
    handleCloseNotification: handleCloseSocketNotification,
  } = useLogSocket({
    logs,
    setLogs,
    isFiltered,
    filterUser,
    filterRole,
  });

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setFilterRole(newRole);
    
    if (newRole === "All") {
      resetFilters();
    } else {
      fetchLogsByRole(newRole);
      setIsFiltered(true);
    }
  };

  const handleUserFilterSubmit = (e) => {
    e.preventDefault();
    if (filterUser) {
      fetchLogsByUser(filterUser);
      setIsFiltered(true);
    }
  };

  const resetFilters = () => {
    setFilterUser("");
    setFilterRole("All");
    setIsFiltered(false);
    fetchLogs();
  };

  const handleClearLogs = async () => {
    if (!window.confirm("Are you sure you want to clear all logs?")) return;
    await clearLogs();
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Logs
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="filter-role-label">Filter by Role</InputLabel>
              <Select
                labelId="filter-role-label"
                label="Filter by Role"
                value={filterRole}
                onChange={handleRoleChange}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Staff">Staff</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              type="button"
              variant="outlined"
              onClick={resetFilters}
            >
              Reset All Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box component="form" onSubmit={handleUserFilterSubmit} sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Filter by User ID"
              variant="outlined"
              fullWidth
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!filterUser}
            >
              Apply User Filter
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
        onClose={handleCloseSocketNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSocketNotification}
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
