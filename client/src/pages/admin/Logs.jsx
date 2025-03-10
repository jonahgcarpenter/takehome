import React, { useState, useCallback, useEffect } from "react";
import LogEntry from "../../components/admin/LogEntry";
import useLogs from "../../hooks/api/useLogs";
import useLogSocket from "../../hooks/websockets/useLogSockets";
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  Paper,
  TextField,
} from "@mui/material";

/**
 * Logs Component - Admin page for viewing and managing system logs
 * Provides functionality for filtering, searching, and clearing logs
 */
const Logs = () => {
  const {
    logs,
    loading,
    error,
    fetchLogs,
    fetchLogsByUser,
    fetchLogsByRole,
    clearLogs,
  } = useLogs();
  
  /**
   * State for managing filters and dialogs
   */
  const [filterUser, setFilterUser] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [isFiltered, setIsFiltered] = useState(false);
  const [clearDialog, setClearDialog] = useState(false);
  const [noUserAlert, setNoUserAlert] = useState(false);

  /**
   * Handles role filter changes
   * @param {Object} e - Event object from role select
   */
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

  /**
   * Handles user search with enter key
   * @param {Object} e - Keyboard event object
   */
  const handleUserSearch = (e) => {
    if (e.key === 'Enter') {
      const searchTerm = e.target.value.trim();
      if (!searchTerm) {
        resetFilters();
        return;
      }

      const matchingUser = logs.find(log => 
        log.user?.displayName?.toLowerCase() === searchTerm.toLowerCase()
      )?.user;

      if (matchingUser) {
        setFilterUser(searchTerm);
        setIsFiltered(true);
        setNoUserAlert(false);
        fetchLogsByUser(matchingUser.id);
      } else {
        setNoUserAlert(true);
        setTimeout(() => {
          setNoUserAlert(false);
          resetFilters();
        }, 3000);
      }
    }
  };

  /**
   * Resets all filters to default values
   */
  const resetFilters = () => {
    setFilterUser("");
    setFilterRole("All");
    setIsFiltered(false);
    fetchLogs();
  };

  const handleClearClick = () => {
    setClearDialog(true);
  };

  const handleClearCancel = () => {
    setClearDialog(false);
  };

  const handleClearConfirm = async () => {
    try {
      await clearLogs();
    } finally {
      setClearDialog(false);
    }
  };

  /**
   * Handles real-time log updates from WebSocket
   */
  const handleLogsUpdated = useCallback(
    (newLog) => {
      if (!isFiltered) {
        fetchLogs();
      } else if (
        (filterRole !== "All" && newLog.role === filterRole) ||
        (filterUser && newLog.user?.displayName?.toLowerCase() === filterUser.toLowerCase())
      ) {
        fetchLogs();
      }
    },
    [isFiltered, filterRole, filterUser, fetchLogs]
  );

  // Initialize websocket connection
  useLogSocket({
    onLogsUpdated: handleLogsUpdated,
  });

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
          Logs
        </Typography>
        <Divider sx={{ mb: 3, borderColor: "#444" }} />

        {/* Filter Controls */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            {/* Role Filter */}
            <Grid item xs={12} md={4}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ backgroundColor: "#333", borderRadius: 1 }}
              >
                <InputLabel id="filter-role-label" sx={{ color: "#eee" }}>
                  Filter by Role
                </InputLabel>
                <Select
                  labelId="filter-role-label"
                  label="Filter by Role"
                  value={filterRole}
                  onChange={handleRoleChange}
                  sx={{
                    color: "#eee",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                  }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Staff">Staff</MenuItem>
                  <MenuItem value="Customer">Customer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* User Search */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search by User"
                variant="outlined"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                onKeyPress={handleUserSearch}
                placeholder="Press Enter to search"
                sx={{
                  backgroundColor: "#333",
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#444',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#eee',
                  },
                  '& .MuiInputBase-input': {
                    color: '#eee',
                  },
                }}
              />
            </Grid>
            {/* Reset Filters */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={resetFilters}
                sx={{
                  height: "56px",
                  borderColor: "#444",
                  color: "#eee",
                  "&:hover": {
                    borderColor: "primary.main",
                    color: "primary.main",
                  },
                }}
              >
                Reset All Filters
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Clear Logs Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleClearClick}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
            }}
          >
            Clear All Logs
          </Button>
        </Box>

        <Divider sx={{ mb: 4, borderColor: "#444" }} />

        {noUserAlert && (
          <Alert severity="info" sx={{ my: 3 }}>
            No user found with that name. Filters will reset in 3 seconds.
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && logs.length === 0 && !error && (
          <Typography sx={{ textAlign: "center", color: "#ccc", my: 4 }}>
            No logs found.
          </Typography>
        )}

        {/* Logs Display Section */}
        <Box sx={{ backgroundColor: "#2C2C2C", borderRadius: 1, py: 2 }}>
          {logs.map((log) => (
            <LogEntry key={log._id || log.id} log={log} />
          ))}
        </Box>
      </Paper>

      {/* Clear Logs Confirmation Dialog */}
      <Dialog
        open={clearDialog}
        onClose={handleClearCancel}
        aria-labelledby="clear-dialog-title"
        aria-describedby="clear-dialog-description"
        PaperProps={{
          sx: {
            backgroundColor: "#2C2C2C",
            color: "#eee",
          },
        }}
      >
        <DialogTitle id="clear-dialog-title">Confirm Clear Logs</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="clear-dialog-description"
            sx={{ color: "#fff" }}
          >
            Are you sure you want to clear all logs? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClearConfirm} color="error" autoFocus>
            Clear All Logs
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Logs;
