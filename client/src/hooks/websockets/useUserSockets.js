import { useEffect } from "react";
import { socket } from "../../services/socketService";

const useUserSocket = ({ onUsersUpdated }) => {
  useEffect(() => {
    // Listen to user-related events
    socket.on("users-updated", onUsersUpdated);

    // Cleanup listeners when component unmounts
    return () => {
      socket.off("users-updated", onUsersUpdated);
    };
  }, [onUsersUpdated]);
};

export default useUserSocket;
