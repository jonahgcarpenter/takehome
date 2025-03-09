import { useEffect } from "react";
import { socket } from "../../services/socketService";

const useOrderSocket = ({ onOrderCreated, onOrderUpdated, onOrderDeleted }) => {
  useEffect(() => {
    // Listen to product-related events
    socket.on("order-created", onOrderCreated);
    socket.on("order-updated", onOrderUpdated);
    socket.on("order-deleted", onOrderDeleted);

    // Cleanup listeners when component unmounts
    return () => {
      socket.off("order-created", onOrderCreated);
      socket.off("order-updated", onOrderUpdated);
      socket.off("order-deleted", onOrderDeleted);
    };
  }, [onOrderCreated, onOrderUpdated, onOrderDeleted]);
};

export default useOrderSocket;
