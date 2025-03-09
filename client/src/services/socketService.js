import { io } from "socket.io-client";

// Create and export the socket instance
export const socket = io("/", {
  autoConnect: true,
});

// Connection status events for debugging
socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

// Socket service with helper functions
const socketService = {
  getSocket: () => socket,

  // Disconnect the socket (useful when user logs out)
  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
    }
  },

  // Reconnect the socket if needed
  connect: () => {
    if (!socket.connected) {
      socket.connect();
    }
  },
};

export default socketService;
