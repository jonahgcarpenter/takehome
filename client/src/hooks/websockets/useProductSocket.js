import { useEffect } from "react";
import { socket } from "../../services/socketService";

const useProductSocket = ({ onProductsUpdated }) => {
  useEffect(() => {
    // Listen to product events
    socket.on("products-updated", onProductsUpdated);

    // Cleanup listeners when component unmounts
    return () => {
      socket.off("products-updated", onProductsUpdated);
    };
  }, [onProductsUpdated]);
};

export default useProductSocket;
