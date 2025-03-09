import { useEffect } from "react";
import { socket } from "../../services/socketService";

const useUserSocket = ({
  onUserUpdated,
}) => {
  useEffect(() => {
    // Listen to user-related events
    socket.on("user-updated", onUserUpdated);

    // Cleanup listeners when component unmounts
    return () => {
      socket.off("user-updated", onUserUpdated);
    };
  }, [onUserUpdated]);
};

export default useUserSocket;
