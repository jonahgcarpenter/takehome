import { useEffect } from "react";
import { socket } from "../../services/socketService";

const useLogSocket = ({ onLogsUpdated }) => {
  useEffect(() => {
    // Listen to log-related events
    socket.on("logs-updated", onLogsUpdated);

    // Cleanup listeners when component unmounts
    return () => {
      socket.off("logs-updated", onLogsUpdated);
    };
  }, [onLogsUpdated]);
};

export default useLogSocket;
