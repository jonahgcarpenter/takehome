import { useEffect } from "react";
import { socket } from "../../services/socketService";

const useUserSocket = ({
  onUserCreated,
  onUserUpdated,
  onUserDeleted,
  onUserRoleUpdated,
}) => {
  useEffect(() => {
    // Listen to user-related events
    socket.on("user-created", onUserCreated);
    socket.on("user-updated", onUserUpdated);
    socket.on("user-deleted", onUserDeleted);
    socket.on("user-role-updated", onUserRoleUpdated);

    // Cleanup listeners when component unmounts
    return () => {
      socket.off("user-created", onUserCreated);
      socket.off("user-updated", onUserUpdated);
      socket.off("user-deleted", onUserDeleted);
      socket.off("user-role-updated", onUserRoleUpdated);
    };
  }, [onUserCreated, onUserUpdated, onUserDeleted, onUserRoleUpdated]);
};

export default useUserSocket;
