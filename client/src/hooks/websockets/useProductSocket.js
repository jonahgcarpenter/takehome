import { useEffect } from "react";
import { socket } from "../../services/socketService";

const useProductSocket = ({
  onProductCreated,
  onProductUpdated,
  onProductDeleted,
}) => {
  useEffect(() => {
    // Listen to product-related events
    socket.on("product-created", onProductCreated);
    socket.on("product-updated", onProductUpdated);
    socket.on("product-deleted", onProductDeleted);

    // Cleanup listeners when component unmounts
    return () => {
      socket.off("product-created", onProductCreated);
      socket.off("product-updated", onProductUpdated);
      socket.off("product-deleted", onProductDeleted);
    };
  }, [onProductCreated, onProductUpdated, onProductDeleted]);
};

export default useProductSocket;
