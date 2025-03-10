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
} from "@mui/material";

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
  const [filterUser, setFilterUser] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [isFiltered, setIsFiltered] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [clearDialog, setClearDialog] = useState(false);

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

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setFilterUser(userId);

    if (userId === "All") {
      resetFilters();
    } else {
      fetchLogsByUser(userId);
      setIsFiltered(true);
    }
  };

  const resetFilters = () => {
    setFilterUser("All");
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

  useEffect(() => {
    const uniqueUsers = [
      ...new Set(
        logs
          .map((log) => {
            if (log.user && typeof log.user === "object") {
              return JSON.stringify({
                id: log.user.id,
                displayName: log.user.displayName,
              });
            }
            return null;
          })
          .filter(Boolean),
      ),
    ].map((userStr) => JSON.parse(userStr));

    setAvailableUsers(uniqueUsers);
  }, [logs]);

  // Handle real-time log updates
  const handleLogsUpdated = useCallback(
    (newLog) => {
      if (!isFiltered) {
        fetchLogs();
      } else if (
        (filterRole !== "All" && newLog.role === filterRole) ||
        (filterUser !== "All" && newLog.user?.id === filterUser)
      ) {
        fetchLogsByUser(filterUser);
      }
    },
    [isFiltered, filterRole, filterUser, fetchLogs, fetchLogsByUser],
  );

  // Initialize websocket connection
  useLogSocket({
    onLogsUpdated: handleLogsUpdated,
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: "#2C2C2C",
          color: "#eee",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 3, fontWeight: 500, color: "primary.main" }}
        >
          Logs
        </Typography>
        <Divider sx={{ mb: 3, borderColor: "#444" }} />

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3}>
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
            <Grid item xs={12} md={4}>
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ backgroundColor: "#333", borderRadius: 1 }}
              >
                <InputLabel id="filter-user-label" sx={{ color: "#eee" }}>
                  Filter by User
                </InputLabel>
                <Select
                  labelId="filter-user-label"
                  label="Filter by User"
                  value={filterUser}
                  onChange={handleUserChange}
                  sx={{
                    color: "#eee",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                  }}
                >
                  <MenuItem value="All">All Users</MenuItem>
                  {availableUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.displayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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

        <Box sx={{ backgroundColor: "#2C2C2C", borderRadius: 1, py: 2 }}>
          {logs.map((log) => (
            <LogEntry key={log._id || log.id} log={log} />
          ))}
        </Box>
      </Paper>

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
