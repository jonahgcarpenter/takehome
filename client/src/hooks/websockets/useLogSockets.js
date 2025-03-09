import { useEffect } from "react";
import { socket } from "../../services/socketService";

const useLogSocket = ({ onLogCreated, onLogsCleared }) => {
  useEffect(() => {
    // Listen to log-related events
    socket.on("log-created", onLogCreated);
    socket.on("logs-cleared", onLogsCleared);

    // Cleanup listeners when component unmounts
    return () => {
      socket.off("log-created", onLogCreated);
      socket.off("logs-cleared", onLogsCleared);
    };
  }, [onLogCreated, onLogsCleared]);
};

export default useLogSocket;
