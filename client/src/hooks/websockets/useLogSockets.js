import { useState, useEffect, useCallback } from "react";
import { socket } from "../../services/socketService";

const useLogSocket = ({ logs, setLogs, isFiltered, filterUser, filterRole }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info"
  });

  const showNotification = useCallback((message, type = "info") => {
    setNotification({ open: true, message, type });
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  const handleLogCreated = useCallback((newLog) => {
    // Ensure we have all required fields
    if (!newLog.method || !newLog.route) {
      console.error('Invalid log entry received:', newLog);
      return;
    }

    // Check if the log matches current filters
    const matchesFilter = !isFiltered || 
      (filterUser && newLog.user === filterUser) || 
      (filterRole !== "All" && newLog.role === filterRole);

    if (matchesFilter) {
      setLogs(prevLogs => [newLog, ...prevLogs]);
      showNotification(
        `New ${newLog.method} request to ${newLog.route}`,
        newLog.responseStatus >= 400 ? 'warning' : 'info'
      );
    } else if (isFiltered) {
      showNotification(
        "New log entry received (not shown due to active filters)",
        "info"
      );
    }
  }, [isFiltered, filterUser, filterRole, setLogs]);

  const handleLogsCleared = useCallback(() => {
    setLogs([]);
    showNotification("All logs have been cleared", "info");
  }, [setLogs]);

  useEffect(() => {
    socket.on("log-created", handleLogCreated);
    socket.on("logs-cleared", handleLogsCleared);

    return () => {
      socket.off("log-created", handleLogCreated);
      socket.off("logs-cleared", handleLogsCleared);
    };
  }, [handleLogCreated, handleLogsCleared]);

  return {
    notification,
    handleCloseNotification,
    showNotification
  };
};

export default useLogSocket;
