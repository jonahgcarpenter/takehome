import { useEffect } from "react";
import { socket } from "../../services/socketService";

const useOrderSocket = ({ onOrdersUpdated }) => {
  useEffect(() => {
    // Listen to order events
    socket.on("orders-updated", onOrdersUpdated);

    // Cleanup listeners when component unmounts
    return () => {
      socket.off("orders-updated", onOrdersUpdated);
    };
  }, [onOrdersUpdated]);
};

export default useOrderSocket;
